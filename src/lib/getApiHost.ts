export function getApiHost(req: Request): string | undefined {
  const requestHost = req.headers.get('host') ?? undefined;
  const isProd = process.env.NODE_ENV === 'production';

  return isProd ? requestHost : process.env.HOST ?? requestHost;
}
