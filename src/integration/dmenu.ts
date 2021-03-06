import * as c from '../utility/constant.ts';

export const dmenu = async (
  input: string,
  callback?: (s: string) => string
) => {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  const process = Deno.run({
    cmd: c.dmenuCmd.split(' '),
    stdin: 'piped',
    stdout: 'piped',
  });
  await process.stdin.write(textEncoder.encode(input));
  process.stdin.close();
  const status = await process.status();
  if (!status.success) {
    throw new Error('dmenu terminated by user');
  }

  const decoded = textDecoder.decode(await process.output());

  if (callback) {
    return callback(decoded);
  }

  return decoded;
};
