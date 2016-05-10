# SymbolicatingForUmeng

项目使用Swift进行开发，编译时打开了Bitcode。
使用友盟提供的工具无法将导出的错误符号化。
使用atos将错误日志进行符号化。

## Requirement
nodejs v4.2.3

## Installation

```bash
git clone https://github.com/killa123/SymbolicatingForUmeng
npm install
```

## Start

```bash
node --harmony_destructuring symbolicatingForUmeng.js CrashPath dSYMsDir
```

## Crash File Example
```
Application received signal SIGSEGV
(null)
((
	0   CoreFoundation                      0x0000000182c56e50 <redacted> + 148
	1   libobjc.A.dylib                     0x00000001822bbf80 objc_exception_throw + 56
	2   CoreFoundation                      0x0000000182c56d80 <redacted> + 0
	3   ???                           0x000000010041f360 ??? + 3404640
	4   libsystem_platform.dylib            0x00000001828b593c _sigtramp + 52
	5   ???                           0x00000001001a8ae0 ??? + 821984
	6   ???                           0x00000001001aa810 ??? + 829456
	7   ???                           0x00000001001ac6d4 ??? + 837332
	8   Alamofire                           0x00000001007176f0 _TMaCC9Alamofire7Request20DownloadTaskDelegate + 4772
	9   Alamofire                           0x0000000100716f9c _TMaCC9Alamofire7Request20DownloadTaskDelegate + 2896
	10  Alamofire                           0x000000010071f7ac _TTSf4g_g_n_n_n_n___TFCC9Alamofire7Manager15SessionDelegate10URLSessionfTCSo12NSURLSession12downloadTaskCSo24NSURLSessionDownloadTask12didWriteDataVs5Int6417totalBytesWrittenS4_25totalBytesExpectedToWriteS4__T_ + 468
	11  Alamofire                           0x000000010071d00c _TFCC9Alamofire7Manager15SessionDelegate10URLSessionfTCSo12NSURLSession12downloadTaskCSo24NSURLSessionDownloadTask12didWriteDataVs5Int6417totalBytesWrittenS4_25totalBytesExpectedToWriteS4__T_ + 144
	12  CFNetwork                           0x0000000183365d7c <redacted> + 44
	13  Foundation                          0x0000000183610510 <redacted> + 16
	14  Foundation                          0x0000000183562900 <redacted> + 96
	15  Foundation                          0x0000000183552ed8 <redacted> + 604
	16  Foundation                          0x0000000183612904 <redacted> + 224
	17  libdispatch.dylib                   0x00000001826a147c <redacted> + 16
	18  libdispatch.dylib                   0x00000001826ad4c0 <redacted> + 864
	19  libdispatch.dylib                   0x00000001826a4f80 <redacted> + 464
	20  libdispatch.dylib                   0x00000001826af390 <redacted> + 728
	21  libdispatch.dylib                   0x00000001826af0b0 <redacted> + 112
	22  libsystem_pthread.dylib             0x00000001828b9470 _pthread_wqthread + 1092
	23  libsystem_pthread.dylib             0x00000001828b9020 start_wqthread + 4
)

dSYM UUID: 9867AE23-0311-36A6-ACDA-C6F78B45293B
CPU Type: arm64
Slide Address: 0x0000000100000000
Binary Image: ???
Base Address: 0x00000001000e0000
```
