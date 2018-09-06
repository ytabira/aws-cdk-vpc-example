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
