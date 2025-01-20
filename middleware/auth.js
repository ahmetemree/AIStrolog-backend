import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
    onError: (error) => {
        error.stack = '';
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized'
        });
    }
    
});