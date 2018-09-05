# aws-cdkを使ってVPC環境を作る

## 環境

```console
$ sw_vers
ProductName:    Mac OS X
ProductVersion: 10.13.6
BuildVersion:   17G65
```

```console
$ node -v
v10.8.0
```

```console
$ npm -v
6.2.0
```

## aws cdkのインストール

```console
$ sudo npm install -g aws-cdk
Password:
/Users/ytabira/.nodebrew/node/v10.8.0/bin/cdk -> /Users/ytabira/.nodebrew/node/v10.8.0/lib/node_modules/aws-cdk/bin/cdk
+ aws-cdk@0.8.2
updated 9 packages in 12.707s
```

## サンプルコード

```typescript
import ec2 = require('@aws-cdk/aws-ec2');

class SampleStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    // https://awslabs.github.io/aws-cdk/refs/_aws-cdk_aws-ec2.html#vpcresource
    const vpc = new ec2.cloudformation.VPCResource(this, 'VPC', {
      cidrBlock: '10.0.0.0/16',
      tags: [
        {
          key: 'Name',
          value: `${this.name}`
        }
      ]
    });
}

class SampleApp extends cdk.App {
  constructor(argv: string[]) {
    super(argv);
    new SampleStack(this, 'Sample');
  }
}

process.stdout.write(new SuiminApp(process.argv).run());

```


```console
$ npm run build && cdk deploy
```
