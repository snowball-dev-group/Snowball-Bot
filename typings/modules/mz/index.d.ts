// Generated by typings
// Source: https://raw.githubusercontent.com/types/npm-mz/5fdd82eac73b11b9fcedc2a57b5c9a7deb438491/dns.d.ts
declare module '~mz/dns' {

export * from 'dns';

export function lookup(domain: string, family: number): Promise<[string, number]>;
export function lookup(domain: string): Promise<[string, number]>;
export function resolve(domain: string, rrtype: string): Promise<string[]>;
export function resolve(domain: string): Promise<string[]>;
export function resolve4(domain: string): Promise<string[]>;
export function resolve6(domain: string): Promise<string[]>;
export function resolveMx(domain: string): Promise<string[]>;
export function resolveTxt(domain: string): Promise<string[]>;
export function resolveSrv(domain: string): Promise<string[]>;
export function resolveNs(domain: string): Promise<string[]>;
export function resolveCname(domain: string): Promise<string[]>;
export function reverse(ip: string): Promise<string[]>;
}
declare module 'mz/dns' {
export * from '~mz/dns';
}

// Generated by typings
// Source: https://raw.githubusercontent.com/types/npm-mz/5fdd82eac73b11b9fcedc2a57b5c9a7deb438491/crypto.d.ts
declare module '~mz/crypto' {

export * from 'crypto';

export function pbkdf2(password: string | Buffer, salt: string | Buffer, iterations: number, keylen: number): Promise<Buffer>;
export function pbkdf2(password: string | Buffer, salt: string | Buffer, iterations: number, keylen: number, digest: string): Promise<Buffer>;

export function randomBytes(size: number): Promise<Buffer>;

export function pseudoRandomBytes(size: number): Promise<Buffer>;
}
declare module 'mz/crypto' {
export * from '~mz/crypto';
}

// Generated by typings
// Source: https://raw.githubusercontent.com/types/npm-mz/5fdd82eac73b11b9fcedc2a57b5c9a7deb438491/child_process.d.ts
declare module '~mz/child_process' {

import {ExecFileOptions, ExecOptions} from 'child_process';

export * from 'child_process';

export function exec(command: string): Promise<[string, string]>;
export function exec(command: string, options: ExecOptions & { encoding: 'buffer' }): Promise<[Buffer, Buffer]>;
export function exec(command: string, options: ExecOptions): Promise<[string, string]>;

export function execFile(file: string): Promise<[string, string]>;
export function execFile(file: string, options?: ExecFileOptions & { encoding: 'buffer' }): Promise<[Buffer, Buffer]>;
export function execFile(file: string, options?: ExecFileOptions): Promise<[string, string]>;
export function execFile(file: string, args?: string[]): Promise<[string, string]>;
export function execFile(file: string, args?: string[], options?: ExecFileOptions & { encoding: 'buffer' }): Promise<[Buffer, Buffer]>;
export function execFile(file: string, args?: string[], options?: ExecFileOptions): Promise<[string, string]>;
}
declare module 'mz/child_process' {
export * from '~mz/child_process';
}

// Generated by typings
// Source: https://raw.githubusercontent.com/types/npm-mz/5fdd82eac73b11b9fcedc2a57b5c9a7deb438491/fs.d.ts
declare module '~mz/fs' {

import {Stats, FSWatcher} from 'fs';

export * from 'fs';

export function rename(oldPath: string, newPath: string): Promise<void>;
export function truncate(path: string | Buffer): Promise<void>;
export function truncate(path: string | Buffer, len: number): Promise<void>;
export function ftruncate(fd: number): Promise<void>;
export function ftruncate(fd: number, len: number): Promise<void>;
export function chown(path: string | Buffer, uid: number, gid: number): Promise<void>;
export function fchown(fd: number, uid: number, gid: number): Promise<void>;
export function lchown(path: string | Buffer, uid: number, gid: number): Promise<void>;
export function chmod(path: string | Buffer, mode: number): Promise<void>;
export function chmod(path: string | Buffer, mode: string): Promise<void>;
export function fchmod(fd: number, mode: number): Promise<void>;
export function fchmod(fd: number, mode: string): Promise<void>;
export function lchmod(path: string | Buffer, mode: number): Promise<void>;
export function lchmod(path: string | Buffer, mode: string): Promise<void>;
export function stat(path: string | Buffer): Promise<Stats>;
export function lstat(path: string | Buffer): Promise<Stats>;
export function fstat(fd: number): Promise<Stats>;
export function link(srcpath: string | Buffer, dstpath: string | Buffer): Promise<void>;
export function symlink(srcpath: string | Buffer, dstpath: string | Buffer, type?: string): Promise<void>;
export function readlink(path: string | Buffer): Promise<string>;
export function realpath(path: string | Buffer): Promise<string>;
export function realpath(path: string | Buffer, cache: { [path: string]: string }): Promise<string>;
export function unlink(path: string | Buffer): Promise<void>;
export function rmdir(path: string | Buffer): Promise<void>;
export function mkdir(path: string | Buffer): Promise<void>;
export function mkdir(path: string | Buffer, mode: number): Promise<void>;
export function mkdir(path: string | Buffer, mode: string): Promise<void>;
export function mkdtemp(prefix: string): Promise<string>;
export function readdir(path: string | Buffer): Promise<string[]>;
export function close(fd: number): Promise<void>;
export function open(path: string | Buffer, flags: string): Promise<number>;
export function open(path: string | Buffer, flags: string, mode: number): Promise<number>;
export function open(path: string | Buffer, flags: string, mode: string): Promise<number>;
export function utimes(path: string | Buffer, atime: number, mtime: number): Promise<void>;
export function utimes(path: string | Buffer, atime: Date, mtime: Date): Promise<void>;
export function futimes(fd: number, atime: number, mtime: number): Promise<void>;
export function futimes(fd: number, atime: Date, mtime: Date): Promise<void>;
export function fsync(fd: number): Promise<void>;
export function write(fd: number, buffer: Buffer, offset: number, length: number, position: number): Promise<[number, Buffer]>;
export function write(fd: number, buffer: Buffer, offset: number, length: number): Promise<[number, Buffer]>;
export function write(fd: number, data: any): Promise<[number, string]>;
export function write(fd: number, data: any, offset: number): Promise<[number, string]>;
export function write(fd: number, data: any, offset: number, encoding: string): Promise<[number, string]>;
export function read(fd: number, buffer: Buffer, offset: number, length: number, position: number): Promise<[number, Buffer]>;
export function readFile(filename: string, encoding: string): Promise<string>;
export function readFile(filename: string, options: { encoding: string; flag?: string; }): Promise<string>;
export function readFile(filename: string, options: { flag?: string; }): Promise<Buffer>;
export function readFile(filename: string): Promise<Buffer>;
export function writeFile(filename: string, data: any): Promise<void>;
export function writeFile(filename: string, data: any, options: { encoding?: string; mode?: number; flag?: string; }): Promise<void>;
export function writeFile(filename: string, data: any, options: { encoding?: string; mode?: string; flag?: string; }): Promise<void>;
export function appendFile(filename: string, data: any, options: { encoding?: string; mode?: number; flag?: string; }): Promise<void>;
export function appendFile(filename: string, data: any, options: { encoding?: string; mode?: string; flag?: string; }): Promise<void>;
export function appendFile(filename: string, data: any): Promise<void>;
export function exists(path: string | Buffer): Promise<boolean>;
export function access(path: string | Buffer): Promise<void>;
export function access(path: string | Buffer, mode: number): Promise<void>;
}
declare module 'mz/fs' {
export * from '~mz/fs';
}

// Generated by typings
// Source: https://raw.githubusercontent.com/types/npm-mz/5fdd82eac73b11b9fcedc2a57b5c9a7deb438491/zlib.d.ts
declare module '~mz/zlib' {

export * from 'zlib';

import {ZlibOptions} from 'zlib';

export function deflate(buf: Buffer | string, options?: ZlibOptions): Promise<any>;
export function deflateRaw(buf: Buffer | string, options?: ZlibOptions): Promise<any>;
export function gzip(buf: Buffer | string, options?: ZlibOptions): Promise<any>;
export function gunzip(buf: Buffer | string, options?: ZlibOptions): Promise<any>;
export function inflate(buf: Buffer | string, options?: ZlibOptions): Promise<any>;
export function inflateRaw(buf: Buffer | string, options?: ZlibOptions): Promise<any>;
export function unzip(buf: Buffer | string, options?: ZlibOptions): Promise<any>;
}
declare module 'mz/zlib' {
export * from '~mz/zlib';
}

// Generated by typings
// Source: https://raw.githubusercontent.com/types/npm-mz/5fdd82eac73b11b9fcedc2a57b5c9a7deb438491/readline.d.ts
declare module '~mz/readline' {

import { Completer} from 'readline';
export * from 'readline';

export interface ReadLine {
    question(query: string): Promise<string>;
}

export function createInterface(input: NodeJS.ReadableStream, output?: NodeJS.WritableStream, completer?: Completer, terminal?: boolean): ReadLine;
export function createInterface(options: any): ReadLine;
}
declare module 'mz/readline' {
export * from '~mz/readline';
}

// Generated by typings
// Source: https://raw.githubusercontent.com/types/npm-mz/5fdd82eac73b11b9fcedc2a57b5c9a7deb438491/index.d.ts
declare module '~mz/index' {

import '~mz/dns';
import '~mz/crypto';
import '~mz/child_process';
import '~mz/fs';
import '~mz/zlib';
import '~mz/readline';
}