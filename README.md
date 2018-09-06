# aws-cdkを使ってvpc環境を作る

以下のイメージのVPC環境をaws-cdkを使って作成する。
![aws-sdk-vpc.png](https://qiita-image-store.s3.amazonaws.com/0/81973/5a123ec2-7df6-a72a-4156-8ff39f6c8b4f.png)

## 参照元

[AWS Cloud Development Kit](https://awslabs.github.io/aws-cdk/index.html)

## 環境

MacOS

```console
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.13.6
BuildVersion:   17G65
```

[Node.js (>= 8.11.x)](https://nodejs.org/en/download/)

```console
$ node -v
v10.8.0
```

```console
$ npm -v
6.2.0
```

## セットアップ

### 前提条件

AWS CLI のインストールと AWS 認証情報が指定が完了していること。
[AWS Command Line Interface のインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/installing.html)
[AWS CLI の設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-getting-started.html)

### aws cdkのインストール

```console
$ sudo npm install -g aws-cdk
Password:
/Users/ytabira/.nodebrew/node/v10.8.0/bin/cdk -> /Users/ytabira/.nodebrew/node/v10.8.0/lib/node_modules/aws-cdk/bin/cdk
+ aws-cdk@0.8.2
updated 9 packages in 12.707s
```

## プロジェクトの初期化

### 空の git リポジトリを作成と npm の初期化

```console
$ mkdir aws-cdk-vpc-example
$ cd aws-cdk-vpc-example
$ git init
$ npm init -y
Wrote to /Users/ytabira/repos/aws-cdk-vpc-example/package.json:

{
  "name": "aws-cdk-vpc-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ytabira/aws-cdk-vpc-example.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ytabira/aws-cdk-vpc-example/issues"
  },
  "homepage": "https://github.com/ytabira/aws-cdk-vpc-example#readme"
}
```

### AWS CDK コアライブラリ(@aws-cdk/cdk)をインストールする

```console
$ npm install @aws-cdk/cdk @types/node
+ @types/node@10.9.4
+ @aws-cdk/cdk@0.8.2
added 1 package and updated 1 package in 5.04s
```

### 必要最小限の `tsconfig.json` を作成する

```json
{
  "compilerOptions": {
      "target": "es2018",
      "module": "commonjs"
  }
}
```

### TypeScriptのビルドコマンドを `package.json` に追記する

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w"
  }
}
```

### `node` が `index.js` を使用するように `--app` オプションを `cdk.json` に設定する

```json
// cdk.json
{
  "app": "node index.js"
}
```

### 使用するリージョンを `cdk.json` で指定する

↓東京リージョンで `ap-northeast-1b` と `ap-northeast-1c` だけ使用する。

```json
// cdk.json
{
  "app": "node index.js"
  "context": {
    "availability-zones:422351357158:ap-northeast-1": [
      "ap-northeast-1b",
      "ap-northeast-1c"
    ]
  }
}
```

### VPCのライブラリをインストールする

```console
$ npm i @aws-cdk/aws-ec2@0.8.2
+ @aws-cdk/aws-ec2@0.8.2
updated 1 package in 8.98s
```

## AWS CDK アプリケーションを定義する

```typescript
// index.ts

import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');

class MyStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new ec2.VpcNetwork(this, 'VPC', {
      tags: [
        {
          key: 'Name',
          value: this.name
        }
      ]
    });
  }
}

class MyApp extends cdk.App {
  constructor(argv) {
    super(argv);

    new MyStack(this, 'vpc-example', {});
  }
}

process.stdout.write(new MyApp(process.argv).run());
```

## 作成したコードをコンパイルする

```console
$ npm run build

> aws-cdk-vpc-example@1.0.0 build /Users/ytabira/repos/aws-cdk-vpc-example
> tsc
```

`watch` コマンドを使用するとコードが変更されたと同時にコンパイルが実行される。

```console
$ npm run watch
[18:08:11] Starting compilation in watch mode...

[18:08:15] Found 0 errors. Watching for file changes.
```

## スタックをデプロイする

```console
$ cdk deploy
 ⏳  Starting deployment of stack vpc-example...
[0/2] Wed Sep 05 2018 18:52:26 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::CloudFormation::WaitConditionHandle] WaitCondition
[0/2] Wed Sep 05 2018 18:52:26 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::CloudFormation::WaitConditionHandle] WaitCondition Resource creation Initiated
[1/2] Wed Sep 05 2018 18:52:27 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::CloudFormation::WaitConditionHandle] WaitCondition
[2/2] Wed Sep 05 2018 18:52:29 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::CloudFormation::Stack] vpc-example
[ 0/26] Wed Sep 05 2018 18:52:40 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::InternetGateway] VPCIGWB7E252D3
[ 0/26] Wed Sep 05 2018 18:52:41 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::EIP] VPCPublicSubnet2EIP4947BC00
[ 0/26] Wed Sep 05 2018 18:52:41 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::CDK::Metadata] CDKMetadata
[ 0/26] Wed Sep 05 2018 18:52:41 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::EIP] VPCPublicSubnet1EIP6AD938E8
[ 0/26] Wed Sep 05 2018 18:52:41 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::InternetGateway] VPCIGWB7E252D3 Resource creation Initiated
[ 0/26] Wed Sep 05 2018 18:52:42 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::EIP] VPCPublicSubnet2EIP4947BC00 Resource creation Initiated
[ 0/26] Wed Sep 05 2018 18:52:42 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::EIP] VPCPublicSubnet1EIP6AD938E8 Resource creation Initiated
[ 0/26] Wed Sep 05 2018 18:52:43 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::VPC] VPCB9E5F0B4
[ 0/26] Wed Sep 05 2018 18:52:43 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::CDK::Metadata] CDKMetadata Resource creation Initiated
[ 0/26] Wed Sep 05 2018 18:52:44 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::VPC] VPCB9E5F0B4 Resource creation Initiated
[ 1/26] Wed Sep 05 2018 18:52:44 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::CDK::Metadata] CDKMetadata
[ 2/26] Wed Sep 05 2018 18:52:57 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::InternetGateway] VPCIGWB7E252D3
[ 3/26] Wed Sep 05 2018 18:52:58 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::EIP] VPCPublicSubnet1EIP6AD938E8
[ 4/26] Wed Sep 05 2018 18:52:58 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::EIP] VPCPublicSubnet2EIP4947BC00
[ 5/26] Wed Sep 05 2018 18:53:01 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::VPC] VPCB9E5F0B4
[ 5/26] Wed Sep 05 2018 18:53:03 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPublicSubnet1RouteTableFEE4B781
[ 5/26] Wed Sep 05 2018 18:53:03 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPrivateSubnet1Subnet8BCA10E0
[ 5/26] Wed Sep 05 2018 18:53:03 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPublicSubnet2Subnet74179F39
[ 5/26] Wed Sep 05 2018 18:53:03 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPublicSubnet2RouteTable6F1A15F1
[ 5/26] Wed Sep 05 2018 18:53:03 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPublicSubnet1SubnetB4246D30
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPrivateSubnet1RouteTableBE8A6027
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::VPCGatewayAttachment] VPCVPCGW99B986DC
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPublicSubnet1RouteTableFEE4B781 Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPrivateSubnet2RouteTable0A19E10E
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPublicSubnet2RouteTable6F1A15F1 Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPrivateSubnet2SubnetCFCDAA7A
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPrivateSubnet1RouteTableBE8A6027 Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPublicSubnet1SubnetB4246D30 Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPrivateSubnet1Subnet8BCA10E0 Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::VPCGatewayAttachment] VPCVPCGW99B986DC Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:04 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::RouteTable] VPCPrivateSubnet2RouteTable0A19E10E Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:05 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPublicSubnet2Subnet74179F39 Resource creation Initiated
[ 5/26] Wed Sep 05 2018 18:53:05 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Subnet] VPCPrivateSubnet2SubnetCFCDAA7A Resource creation Initiated
[ 6/26] Wed Sep 05 2018 18:53:05 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::RouteTable] VPCPublicSubnet1RouteTableFEE4B781
[ 7/26] Wed Sep 05 2018 18:53:05 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::RouteTable] VPCPrivateSubnet1RouteTableBE8A6027
[ 8/26] Wed Sep 05 2018 18:53:05 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::RouteTable] VPCPublicSubnet2RouteTable6F1A15F1
[ 9/26] Wed Sep 05 2018 18:53:05 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::RouteTable] VPCPrivateSubnet2RouteTable0A19E10E
[ 9/26] Wed Sep 05 2018 18:53:08 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPublicSubnet2DefaultRouteB7481BBA
[ 9/26] Wed Sep 05 2018 18:53:08 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPublicSubnet1DefaultRoute91CEF279
[ 9/26] Wed Sep 05 2018 18:53:08 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPublicSubnet2DefaultRouteB7481BBA Resource creation Initiated
[ 9/26] Wed Sep 05 2018 18:53:09 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPublicSubnet1DefaultRoute91CEF279 Resource creation Initiated
[10/26] Wed Sep 05 2018 18:53:20 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::VPCGatewayAttachment] VPCVPCGW99B986DC
[11/26] Wed Sep 05 2018 18:53:21 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Subnet] VPCPrivateSubnet1Subnet8BCA10E0
[12/26] Wed Sep 05 2018 18:53:21 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Subnet] VPCPublicSubnet1SubnetB4246D30
[13/26] Wed Sep 05 2018 18:53:21 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Subnet] VPCPublicSubnet2Subnet74179F39
[14/26] Wed Sep 05 2018 18:53:21 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Subnet] VPCPrivateSubnet2SubnetCFCDAA7A
[14/26] Wed Sep 05 2018 18:53:23 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::NatGateway] VPCPublicSubnet1NATGatewayE0556630
[14/26] Wed Sep 05 2018 18:53:23 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPublicSubnet1RouteTableAssociatioin249B4093
[14/26] Wed Sep 05 2018 18:53:23 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPrivateSubnet1RouteTableAssociatioin77F7CA18
[14/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::NatGateway] VPCPublicSubnet1NATGatewayE0556630 Resource creation Initiated
[14/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPrivateSubnet2RouteTableAssociatioinC31995B4
[14/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::NatGateway] VPCPublicSubnet2NATGateway3C070193
[14/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPublicSubnet2RouteTableAssociatioin766225D7
[15/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Route] VPCPublicSubnet2DefaultRouteB7481BBA
[15/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPublicSubnet1RouteTableAssociatioin249B4093 Resource creation Initiated
[15/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPrivateSubnet1RouteTableAssociatioin77F7CA18 Resource creation Initiated
[15/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::NatGateway] VPCPublicSubnet2NATGateway3C070193 Resource creation Initiated
[16/26] Wed Sep 05 2018 18:53:24 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Route] VPCPublicSubnet1DefaultRoute91CEF279
[16/26] Wed Sep 05 2018 18:53:25 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPrivateSubnet2RouteTableAssociatioinC31995B4 Resource creation Initiated
[16/26] Wed Sep 05 2018 18:53:25 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::SubnetRouteTableAssociation] VPCPublicSubnet2RouteTableAssociatioin766225D7 Resource creation Initiated
[17/26] Wed Sep 05 2018 18:53:40 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::SubnetRouteTableAssociation] VPCPublicSubnet1RouteTableAssociatioin249B4093
[18/26] Wed Sep 05 2018 18:53:40 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::SubnetRouteTableAssociation] VPCPrivateSubnet1RouteTableAssociatioin77F7CA18
[19/26] Wed Sep 05 2018 18:53:40 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::SubnetRouteTableAssociation] VPCPrivateSubnet2RouteTableAssociatioinC31995B4
[20/26] Wed Sep 05 2018 18:53:41 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::SubnetRouteTableAssociation] VPCPublicSubnet2RouteTableAssociatioin766225D7
[20/26] Currently in progress: VPCPublicSubnet1NATGatewayE0556630, VPCPublicSubnet2NATGateway3C070193
[21/26] Wed Sep 05 2018 18:55:12 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::NatGateway] VPCPublicSubnet1NATGatewayE0556630
[22/26] Wed Sep 05 2018 18:55:13 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::NatGateway] VPCPublicSubnet2NATGateway3C070193
[22/26] Wed Sep 05 2018 18:55:15 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPrivateSubnet1DefaultRouteAE1D6490
[22/26] Wed Sep 05 2018 18:55:16 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPrivateSubnet1DefaultRouteAE1D6490 Resource creation Initiated
[22/26] Wed Sep 05 2018 18:55:16 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPrivateSubnet2DefaultRouteF4F5CFD2
[22/26] Wed Sep 05 2018 18:55:17 GMT+0900 (JST)  CREATE_IN_PROGRESS  [AWS::EC2::Route] VPCPrivateSubnet2DefaultRouteF4F5CFD2 Resource creation Initiated
[23/26] Wed Sep 05 2018 18:55:31 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Route] VPCPrivateSubnet1DefaultRouteAE1D6490
[24/26] Wed Sep 05 2018 18:55:33 GMT+0900 (JST)  CREATE_COMPLETE     [AWS::EC2::Route] VPCPrivateSubnet2DefaultRouteF4F5CFD2
[24/26] Wed Sep 05 2018 18:55:35 GMT+0900 (JST)  UPDATE_COMPLETE_CLEANUP_IN_PROGRESS  [AWS::CloudFormation::Stack] vpc-example
[24/26] Wed Sep 05 2018 18:55:37 GMT+0900 (JST)  DELETE_IN_PROGRESS  [AWS::CloudFormation::WaitConditionHandle] WaitCondition
[25/26] Wed Sep 05 2018 18:55:38 GMT+0900 (JST)  DELETE_COMPLETE     [AWS::CloudFormation::WaitConditionHandle] WaitCondition
[26/26] Wed Sep 05 2018 18:55:39 GMT+0900 (JST)  UPDATE_COMPLETE     [AWS::CloudFormation::Stack] vpc-example
 ✅  Deployment of stack vpc-example completed successfully, it has ARN arn:aws:cloudformation:ap-northeast-1:422351357158:stack/vpc-example/63587ab0-b0f1-11e8-821f-50a68a175a82
```

完成！
