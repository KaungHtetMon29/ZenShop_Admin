export default {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/products',
        permanent: true
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.lh3.googleusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'zenshopkmd.s3.ap-southeast-1.amazonaws.com',
        search: ''
      }
    ]
  }
};
