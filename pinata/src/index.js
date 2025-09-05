export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (request.method === 'GET' && path !== '/') {
        const hash = path.slice(1);
        return await handleGetFile(hash, env, corsHeaders);
      }

      if (request.method === 'POST' && path === '/upload') {
        return await handleCreateUploadUrl(request, env, corsHeaders);
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Not found',
          message: 'Available endpoints: GET /:hash, POST /upload',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error',
          message: error.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};

async function handleGetFile(hash, env, corsHeaders) {
  if (!hash) {
    return new Response('IPFS hash is required', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders,
      },
    });
  }

  if (!isValidIPFSHash(hash)) {
    return new Response('Invalid IPFS hash format', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders,
      },
    });
  }

  try {
    const gatewayUrl = `https://${env.PINATA_GATEWAY}/ipfs/${hash}`;
    let response = await fetch(gatewayUrl, {
      headers: {
        Authorization: `Bearer ${env.PINATA_JWT}`,
      },
      cf: {
        cacheEverything: true,
        cacheTtl: 31536000,
        cacheTtlByStatus: {
          '200-299': 31536000,
          404: 300,
          '500-599': 0,
        },
      },
    });

    if (!response.ok) {
      return new Response(
        response.status === 404
          ? 'File not found on IPFS'
          : 'Failed to retrieve file from gateway',
        {
          status: response.status,
          headers: {
            'Content-Type': 'text/plain',
            ...corsHeaders,
          },
        }
      );
    }

    response = new Response(response.body, response);

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (
        key.toLowerCase() === 'content-type' ||
        key.toLowerCase() === 'content-length' ||
        key.toLowerCase() === 'content-disposition' ||
        key.toLowerCase() === 'etag' ||
        key.toLowerCase() === 'last-modified'
      ) {
        responseHeaders.set(key, value);
      }
    });

    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return new Response('Internal server error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders,
      },
    });
  }
}

function isValidIPFSHash(hash) {
  if (!hash || typeof hash !== 'string') {
    return false;
  }

  const cidv0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidv1Pattern = /^[a-z0-9]+$/;

  return (
    cidv0Pattern.test(hash) ||
    (hash.startsWith('ba') && cidv1Pattern.test(hash) && hash.length >= 59)
  );
}

async function handleCreateUploadUrl(request, env, corsHeaders) {
  try {
    let options = {
      date: Date.now(),
      expires: 1800, // 30 minutes default
    };

    if (request.headers.get('content-type')?.includes('application/json')) {
      try {
        const body = await request.json();
        if (
          body.expires &&
          typeof body.expires === 'number' &&
          body.expires > 0
        ) {
          options.expires = Math.min(body.expires, 3600); // Max 1 hour
        }
        if (
          body.maxFileSize &&
          typeof body.maxFileSize === 'number' &&
          body.maxFileSize > 0
        ) {
          options.maxFileSize = body.maxFileSize;
        }
        if (body.mimeTypes && Array.isArray(body.mimeTypes)) {
          options.mimeTypes = body.mimeTypes;
        }
        if (body.name && typeof body.name === 'string') {
          options.name = body.name;
        }
        if (body.keyvalues && typeof body.keyvalues === 'object') {
          options.keyvalues = body.keyvalues;
        }
        if (body.groupId && typeof body.groupId === 'string') {
          options.groupId = body.groupId;
        }
      } catch (parseError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Bad request',
            message: 'Invalid JSON in request body',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    const pinataResponse = await fetch(
      'https://uploads.pinata.cloud/v3/files/sign',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.PINATA_JWT}`,
        },
        body: JSON.stringify(options),
      }
    );

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error('Pinata API error:', errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to create upload URL',
          message: `Pinata API error: ${pinataResponse.status}`,
        }),
        {
          status: pinataResponse.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const result = await pinataResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        uploadUrl: result.data,
        expires: options.expires,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error creating upload URL:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to create upload URL',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}
