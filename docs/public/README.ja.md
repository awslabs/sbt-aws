# SaaS Builder Toolkit とは ?

SaaS Builder Toolkit (SBT) 開発者ガイドへようこそ。このドキュメントでは、SBT について説明し、SaaS アプリケーション開発を加速するための使用方法を紹介します。

SBT は、関心のある AWS パートナーとの協力のもと開発されています。 このプロジェクトは GitHub 上で[オープンソース](https://github.com/awslabs/sbt-aws)として公開されています。SBT へのコントリビュート方法については、プロジェクトルートにある[コントリビューティング](https://github.com/awslabs/sbt-aws/blob/main/CONTRIBUTING.md)ドキュメントをご覧ください。

## 背景

AWS では、パートナーやカスタマー向けに、毎年多数のリソースと SaaS 関連のアーティファクトを作成しています。 構築を進める過程で、同じパターンやコード断片がこれらのアーティファクト (特にリファレンスアーキテクチャやいくつかの単一ソリューション) に出現することがわかりました。 多くの場合、これらのアーティファクトの開発を担当するチームは、1 つのソリューションから次のソリューションにコードをコピーしていました。 しかし、コードのコピーには明らかに欠点があり、特に長期的な保守性や俊敏性に影響があります。その結果、これらを再利用可能な構成要素とすることを目的に抽象化する方法を探り始めました。

さらに、ここ数年間で、SaaS アーキテクチャの領域では、アプリケーションプレーンとコントロールプレーンをマルチテナントアーキテクチャ内の 2 つの異なる部分として定義し、境界を明確にしてきました。 この方式は、SaaS ソリューションの構築時に対処が必要な責任とサービスの分離をもたらすため、お客様、パートナー、および SaaS コミュニティ全体に共感されました。

SBT は、これらの 2 つの要素の実現を目的としたプロジェクトです。 簡単にいうと、SBT は次のことを試みています。

* SaaS アーキテクチャにおける第一級の概念として、コントロールプレーンとアプリケーションプレーンやそれらが持つ責任と役割を明確にする
* これらのプレーンそれぞれを一般化しながら、再利用可能な構成要素として抽象化しコード化する
* 2 つのプレーンの間で、ペイロードの形状、期待される動作、ステート管理を含むメッセージフローを十分に明文化する
* 様々な技術スタックと AWS サービスにわたる、AWS 上の SaaS ベストプラクティスを含むフレームワークとコンポーネントセットを提供する

SBT によって、新しい SaaS アプリの開発サイクルが加速することを期待しています。 マルチテナントアーキテクチャを構成する、ボイラープレートコード (訳註 : 「[ボイラープレートコードとは何ですか?](https://aws.amazon.com/jp/what-is/boilerplate-code/)」を参考にしてください。)や構成要素の大部分を処理するか、少なくとも抽象化することで加速されるからです。 このアプローチの副次的な利点は、開発の加速だけでなく、SaaS ドメインにおいてよりパターンを標準化し、より効率的で正確なコミュニケーションができるようになることです。

## 対象読者

このドキュメントは、新しい SaaS アプリケーションを構築する SaaS ビルダーやアーキテクト、または SBT へのソースコード、ドキュメンテーション、設計へのコントリビュートに興味のあるビルダーを対象としています。

## ハイレベルデザイン

このセクションでは、SBT の(私たちが現時点で想定している)すべての可変要素の責務を詳しく説明し、新しい開発者がスピードを上げる基盤を提供します。 明らかに SBT はまだ開発中であり、その設計はほぼ毎日行われているタスクによって形作られ、影響を受けています。 この分野での理解が深まるに従い、このドキュメンテーションを最新で関連性のあるものに保つよう努めます。 以下は SBT の概念図です。

以下の図は SBT の概念図です。

![sbt-conceptual.png](../../images/sbt-conceptual.png)

左側にはコントロールプレーンとその API、そしてその API のクライアントである SBT コマンドラインインターフェイス (CLI) と (オプションの) ウェブ 管理コンソールがあります。 コントロールプレーンの青いボックスは、SaaS アプリケーションによく見られる機能を粗い粒度でまとめたもので表されています。

右側にはアプリケーションプレーンがあります。SBT の設計上、SBT は SaaS アプリケーションそのものにはほとんど関与していません。 コントロールプレーンから送信されるメッセージをサブスクライブし、SBT で定義された規約に従って応答できるのであれば、どのようなアプリケーションもサポートされます。 アプリケーションプレーンの緑のボックスは、開発を支援することを目的とした SBT 付属のユーティリティセットを表しています。 現在、このライブラリには、テナントのプロビジョニングとデプロビジョニングを支援するユーティリティが含まれています (後述)。しかし、SBT が進化するにつれて、その他の構成要素 (緑のボックスの点線の境界で示されています) も拡張されます。

一番上には、ビルダーが提供する設定があります。 これは、ビルダーが提供することが期待されるアプリケーション固有のデータとメタデータです。 例えば、新しいテナントのプロビジョニング設定や、ID と認証の設定がここに含まれます。

中央には、Amazon EventBridge があります。 EventBridge は、大規模なイベント駆動型アプリケーションを構築するためのサーバーレスイベントバスです。 SBT では、それぞれのプレーンで SaaS ワークフローに関連するメッセージをパブリッシュしたり、そのようなメッセージをサブスクライブするためのヘルパーが提供されます。 それらのメッセージの形状と、データや期待される動作については、このドキュメントの[インターフェイス定義](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.ja.md#interface-definitions)セクションで詳しく説明されています。

## ビルダー体験
SBT の具体的なコンポーネントを説明する前に、SBT の期待されるユーザー体験を最初に説明します。 SBT は AWS Cloud Development Kit (CDK) を活用し、CDK の Construct Programming Model (CPM) に準拠しています。 これは何を意味するのでしょうか。説明するよりも例を示した方が簡単かもしれません。 次の例は [CDK の入門ドキュメント](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/home.html#why_use_cdk)からそのまま抜粋したものです。

### CDK の例

```typescript
export class MyEcsConstructStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3 // デフォルトではリージョンの全ての AZ
    });

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });

    // 負荷分散される Fargate サービスを作成し、公開
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster, // 必須
      cpu: 512, // デフォルトは 256
      desiredCount: 6, // デフォルトは 1
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: 2048, // デフォルトは 512
      publicLoadBalancer: true // デフォルトは false
    });
  }
}
```

Typescript に馴染みがない人でも、この部分が何を行っているかは推測できるかもしれません。 簡単に説明すると、このコードでは、新規に作成した VPC 内に ECS クラスターを用意し、負荷分散された Fargate タスクをサービスでラップして作成しています。 CDK は、この数行の TypeScript コードを "synthesizing" というプロセスを通じて、 500 行以上の CloudFormation へ展開できます。

この例に出てくるオブジェクトは CDK チームによって作成されました。 具体的には、コード内の vpc、cluster、ApplicationLoadBalancedFargateService です。 CDK では、これらのオブジェクトをコンストラクトと呼んでいます。 CDK の内部では、独自のコンストラクトを作成するためのツールと抽象化が提供されています。 一部のコンストラクトは CloudFormation のタイプと 1 対 1 の対応関係がありますが、他のコンストラクトはより高機能です (上の例の ECS サービスなど)。

### チュートリアル

> [!警告]
> このチュートリアルを実行すると、AWS アカウントで料金が発生する可能性があります。

前述の通り、SBT は CDK を利用して構築されています。 その使用例を示すため、まず CDK の入門ガイドに従って新しい CDK アプリケーションを初期化してください。 ガイドは[こちら](https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html#hello_world_tutorial_create_app)にあります。 hello cdk チュートリアルのステップ 1 まで完了してから、ここに戻って SBT の作業を続けてください。 サンプルアプリを構築やデプロイする必要はありません。

新しい CDK アプリが初期化できたら、SBT コンポーネントをインストールしましょう。 `hello-cdk` ディレクトリー内で次のコマンドを実行してください。

```sh
npm install @cdklabs/sbt-aws
```

#### コントロールプレーン

SBT がインストールできたので、新しい SBT コントロールプレーンを作成しましょう。 `lib/control-plane.ts` という新しいファイルを作成し、次の内容を記入してください。 メールアドレスは、一時的な管理者パスワードを受け取るためのものなので、実際のメールアドレスに置き換えてください。

```typescript
import { CognitoAuth, ControlPlane } from '@cdklabs/sbt-aws';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ControlPlaneStack extends Stack {
  public readonly regApiGatewayUrl: string;
  public readonly eventBusArn: string;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id, props);
    const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', {
      idpName: 'COGNITO',
      systemAdminRoleName: 'SystemAdmin',
      systemAdminEmail: 'ENTER YOUR EMAIL HERE',
    });

  // 注意: 明示的に CloudWatch ログを無効化するためには(そして CloudWatch のコストを節約するためには), 
  // disableAPILogging フラグを true に設定してください。
  const controlPlane = new ControlPlane(this, 'ControlPlane', {
      auth: cognitoAuth,
      //disableAPILogging: true
    });
    this.eventBusArn = controlPlane.eventBusArn;
    this.regApiGatewayUrl = controlPlane.controlPlaneAPIGatewayUrl;
  }
}
```

ここでは、"ControlPlaneStack "という新しい[CDKスタック](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/stacks.html)を作成しています。このスタックでは、@cdklabs/sbt-aws パッケージからインポートした 1 つの ControlPlane コンストラクトを作成しています。ControlPlane コンストラクトは、様々なプロパティと共に作成され、その多くは Amazon EventBridge を利用した通信を設定するために使用されます。

ここで触れる価値のあるもう 1 つの重要なコンセプトは、このアプローチのプラガビリティ(pluggability)です。CognitoAuth と呼ばれる auth コンポーネントを作成していることに注目してください。このコンポーネントは SBT コアパッケージで定義された [`IAuth`](https://github.com/awslabs/sbt-aws/blob/main/API.md#iauth-) インターフェイスを実装します。現在、私たちは `IAuth` の Cognito 実装を持っていますが、技術的にはどの ID プロバイダーでもそのインターフェイスを実装できます。

##### ビルド

ここで触れる価値のあるもう 1 つの重要なコンセプトは、このアプローチのプラガビリティ(pluggability)です。CognitoAuth と呼ばれる auth コンポーネントを作成していることに注目してください。このコンポーネントは SBT コアパッケージで定義された [`IAuth`](https://github.com/awslabs/sbt-aws/blob/main/API.md#iauth-) インターフェイスを実装します。現在、私たちは `IAuth` の Cognito 実装を持っていますが、技術的にはどの ID プロバイダーでもそのインターフェイスを実装できます。

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ControlPlaneStack } from '../lib/control-plane';
// import { AppPlaneStack } from '../lib/app-plane';

const app = new cdk.App();
const cp = new ControlPlaneStack(app, 'ControlPlaneStack', {});
// const ap = new AppPlaneStack(app, 'AppPlaneStack', {
//   eventBusArn: cp.eventBusArn,
// });
```

コメントアウトされた数行は、後でアプリケーションプレーンを説明する際に戻って触れます。 すべてを保存したら、hello-cdk プロジェクトのルートから次のコマンドを実行してください。

> [!警告]  
> ControlPlane が Lambda 関数 をデプロイするため、Docker がインストールされている必要があります。
>

```sh
npm run build
cdk bootstrap
cdk deploy ControlPlaneStack --require-approval never
```

これにより、CDK アプリケーションの AWS CloudFormation への synthesize 処理が開始され、デプロイされます。 背後で多くのリソースが作成されます。このコンストラクトは、コントロールプレーン API の表面だけでなく、テナントプロビジョニングと管理のための複数のサービスを AWS Lambda 関数としてもデプロイします。

AWS コンソールを開いて、次のサービスを確認してみてください (デプロイした同じリージョンにいることを確認してください)。

* [AWS Lambda](https://console.aws.amazon.com/lambda/home)
* [Amazon Cognito](https://console.aws.amazon.com/cognito/v2/idp/user-pools)
* [API Gateway](https://console.aws.amazon.com/apigateway/main/apis)

確認できたら、左側の[概念図](#high-level-design)部分をコンストラクトひとつでデプロイできました。 コントロールプレーンの API 表面だけでなく、EventBridge との接続まで行われました。 次は、アプリケーションプレーンをデプロイし、同じ EventBridge バスに接続して、コントロールプレーンからのメッセージに対応できるようにしましょう。

#### アプリケーションプレーン

前述のとおり、SBT はデプロイされるアプリケーションについて関心がありません。 そのため、アプリケーションを定義する CDK コンストラクトの 1 つとして、`ApplicationPlane` コンストラクトを作成することを期待しています。 次のような (機能しない) 簡単な例を見てみましょう。

```typescript
export class ApplicationPlaneStack extends Stack {

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id, props);

    new CoreApplicationPlane(this, 'AppPlane', {
      eventBusArn: props.eventBusArn,
      controlPlaneSource: 'testControlPlaneEventSource',
      applicationNamePlaneSource: 'testApplicationPlaneEventSource',
      jobRunnerPropsList: [],
    });
  }
}
```

この例では、SBT のアプリケーションプレーンを作成しており、コントロールプレーンと同じソース名を渡しています。 これにより、両プレーンが Amazon EventBridge 上の同じイベントに接続されます。

この例で欠けているのは、EventBridge イベントのサブスクライブと、それへの対応です。 アプリケーションプレーンの開発者は、コントロールプレーンからパブリッシュされるさまざまなイベントにリスナーを設定し、イベントの要求に応じることができます。 例えば、オンボーディングイベントはコントロールプレーンから送信され、アプリケーションプレーンにテナントリソースのプロビジョニングを要求します。 このイベントのペイロードには、アプリケーションがその作業を完了するのに十分な情報 (テナント名、メールアドレス、ティアなど) が含まれるはずです。 完了したら、アプリケーションプレーンは成功または失敗を示すイベントを送り返すことが期待されています。

繰り返しになりますが、SBT ではビルダーに EventBridge への直接のパブリッシュとサブスクライブを許可しており、そのプロセスに干渉することはありません。 しかし、SBT ライブラリの一部として、典型的なアプリケーションプレーンのワークフローを支援するためのユーティリティセットを公開しています。 そのユーティリティの 1 つを次に見てみます。 その後、学んだことを踏まえてこのコードに戻り、詳細を詰めていきましょう。

#### コアアプリケーションプレーンユーティリティ

オプションとして SBT には、コントロールプレーンのメッセージを受け取ったときに任意のジョブを定義および実行できる `JobRunner` というユーティリティが含まれています。これは、SBT に移植されたリファレンスアーキテクチャ (文末の参照をご覧ください) でのテナントのプロビジョニング/デプロビジョニングに現在使用されているメカニズムです。そのテナントのプロビジョニング/デプロビジョニングのプロセスを次に示します。

![sbt-provisioning.png](../../images/sbt-provisioning.png)

一番上にある `provisioning.sh` と `deprovisioning.sh` スクリプトに注目してください。 これらのスクリプトは `JobRunner` にパラメータとして渡されます。 `JobRunner` の内部では、AWS CodeBuild プロジェクトが AWS Step Function 内にラップされ、Bash スクリプトを実行します。 `JobRunner` では、スクリプトに渡す入力変数と、スクリプトから返すことを期待する出力変数も指定できます。 なお、この SBT のバージョンでは、`JobRunner` は `CoreAppPlane` の `jobRunnerPropsList` 入力に基づいて作成されます (上記のコードの空の配列部分)。 ここでのオブジェクトの型は `[jobRunnerProps](https://github.com/awslabs/sbt-aws/blob/main/API.md#coreapplicationplanejobrunnerprops-)` です。 簡単な例を見てみましょう。SaaS アプリケーションがテナントごとに単一の S3 バケットのみをデプロイするとします。 そのプロビジョニング用の JobRunner を作成しましょう。

```typescript
    const provisioningJobRunnerProps = {
      name: 'provisioning',
      permissions: PolicyDocument.fromJson(/*下記参照*/),
      script: '' /*下記参照*/,
      postScript: '',
      importedVariables: ['tenantId', 'tier'],
      exportedVariables: ['tenantS3Bucket', 'someOtherVariable', 'tenantConfig'],
      scriptEnvironmentVariables: {
        TEST: 'test',
      },
      outgoingEvent: {
        source: applicationNamePlaneSource,
        detailType: provisioningDetailType,
      },
      incomingEvent: {
        source: [controlPlaneSource],
        detailType: [onboardingDetailType],
      },
    };
```

##### Bash ジョブランナープロパティ

このオブジェクトを詳しく見ていきましょう。

| キー                           | タイプ                                                                                                | 用途                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | -----------------------------------------------------------------------------|
| **name**                       | string                                                                                                | name キーはこのジョブの名前です                                              |
| **script**                     | string                                                                                                | 実行されるジョブを表す Bash スクリプト形式の文字列 (以下に例があります)      |
| **permissions**                | [PolicyDocument](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.PolicyDocument.html) |このジョブが要求されたタスクを実行するために必要な IAM ポリシードキュメント   |
| **postScript**                 | string                                                                                                | メインスクリプトが完了した後に実行される Bash スクリプト                     |
| **importedVariables**          | string[]                                                                                              | イベントの詳細フィールドから BashJobRunner にインポートする環境変数          |
| **exportedVariables**          | string[]                                                                                              | BashJobRunner が完了したら、送信イベントにエクスポートする環境変数           |
| **scriptEnvironmentVariables** | `{ [key: string]: string }`                                                                           | codebuild BashJobRunner に渡す変数                                           |
| **outgoingEvent**              | any                                                                                                   | EventBridgeに送信するイベント情報                                            |
| **incomingEvent**              | any                                                                                                   | EventBridgeから受信するイベント情報                                          |

ジョブランナーの本質的な部分は、`script` キーの値にあります。 この特定の例がプロビジョニング用であり、また SaaS アプリケーションが各テナントに S3 バケットを 1 つプロビジョニングするだけだということを思い出してください。 その例のプロビジョニングスクリプトを見てみましょう。 

```sh
echo "starting..."

# この template.json はここで作成されていますが、
# S3 バケットから取得することも可能です。
cat > template.json << EOM
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {"MyBucket": {"Type": "AWS::S3::Bucket"}},
  "Outputs": {"S3Bucket": {"Value": { "Ref": "MyBucket" }}}
}
EOM

echo "tenantId: $tenantId"
echo "tier: $tier"

aws cloudformation create-stack --stack-name "tenantTemplateStack-\${tenantId}"  --template-body "file://template.json"

aws cloudformation wait stack-create-complete --stack-name "tenantTemplateStack-\${tenantId}"

export tenantS3Bucket=$(aws cloudformation describe-stacks --stack-name "tenantTemplateStack-\${tenantId}" | jq -r '.Stacks[0].Outputs[0].OutputValue')
export someOtherVariable="this is a test"
echo $tenantS3Bucket
export tenantConfig=$(jq --arg SAAS_APP_USERPOOL_ID "MY_SAAS_APP_USERPOOL_ID" \
--arg SAAS_APP_CLIENT_ID "MY_SAAS_APP_CLIENT_ID" \
--arg API_GATEWAY_URL "MY_API_GATEWAY_URL" \
-n '{"userPoolId":$SAAS_APP_USERPOOL_ID,"appClientId":$SAAS_APP_CLIENT_ID,"apiGatewayUrl":$API_GATEWAY_URL}')

echo $tenantConfig

echo "done!"
```

このスクリプトをセクションごとに分解していきましょう。

---

###### CloudFormation テンプレート

最初の数行には、S3 バケットを含むサンプルの AWS CloudFormation テンプレートが含まれています。

```sh
# この template.json はここで作成されていますが、
# S3 バケットから取得することも可能です。
cat > template.json << EOM
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {"MyBucket": {"Type": "AWS::S3::Bucket"}},
  "Outputs": {"S3Bucket": {"Value": { "Ref": "MyBucket" }}}
}
EOM
```

この場合、テンプレートはスクリプト内でインラインで宣言されていますが、コメントにあるようにこのテンプレートを S3 バケットに保存することも可能です。 
次に、CloudFormation テンプレートの下に `tenantId` と `tier` の環境変数の値を echo しています。


---

###### インポートされた変数

```sh
echo "tenantId: $tenantId"
echo "tier: $tier"
```

これらの変数がどのように設定されるかを確認してみましょう。 `JobRunner` は内部的に [AWS CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html) プロジェクトを作成することを思い出してください。 `JobRunner` が CodeBuild プロジェクトを作成するとき、どの環境変数を提供するかを指定できます。 また、`JobRunner` ユーティリティは、`incomingEvent` パラメータで指定された条件を満たす EventBridge メッセージによって起動されることを思い出してください。EventBridge を介して到着するメッセージには、送信者 (この場合はコントロールプレーン) が含めたコンテキスト情報を持つ `detail` JSON オブジェクトがあります (ドキュメントは[こちら](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events-structure.html))。 `importedVariables` の各キーに対して、`JobRunner` は EventBridge メッセージの `detail` JSON オブジェクトから一致するキーの値を取得し、その値を環境変数として CodeBuild プロジェクトに提供します。

例えば、次のようなプロビジョニングメッセージがコントロールプレーンから EventBridge 経由で送信された場合を考えてみましょう。

```json
{
  "version": "0",
  "id": "6a7e8feb-b491-4cf7-a9f1-bf3703467718",
  "detail-type": "onboarding",
  "source": "application-plane-source",
  "account": "111122223333",
  "time": "2017-12-22T18:43:48Z",
  "region": "us-west-1",
  "resources": [
    "arn:aws:ec2:us-west-1:123456789012:instance/i-1234567890abcdef0"
  ],
  "detail": {
    "tenantId": "e6878e03-ae2c-43ed-a863-08314487318b",
    "tier": "standard"
  }
}
```

先ほどのスクリプトを実行すると、`tenantId` と `tier` が出力されるはずです。

---

###### テナント用 CloudFormation アーティファクトのデプロイ


次に、上で見た CloudFormation テンプレートを利用してテナント用のインフラストラクチャーをデプロイしています。

```sh
aws cloudformation wait stack-create-complete --stack-name "tenantTemplateStack-\${tenantId}"
```

---

###### エクスポートされた変数

スクリプトの最後の部分では、コントロールプレーンへ返す情報を含む環境変数をエクスポートしています。

```sh
export tenantS3Bucket=$(aws cloudformation describe-stacks --stack-name "tenantTemplateStack-\${tenantId}" | jq -r '.Stacks[0].Outputs[0].OutputValue')
export someOtherVariable="this is a test"
echo $tenantS3Bucket
export tenantConfig=$(jq --arg SAAS_APP_USERPOOL_ID "MY_SAAS_APP_USERPOOL_ID" \
--arg SAAS_APP_CLIENT_ID "MY_SAAS_APP_CLIENT_ID" \
--arg API_GATEWAY_URL "MY_API_GATEWAY_URL" \
-n '{"userPoolId":$SAAS_APP_USERPOOL_ID,"appClientId":$SAAS_APP_CLIENT_ID,"apiGatewayUrl":$API_GATEWAY_URL}')
echo $tenantConfig
```

`importedVariables` に対して実行したのと同様に、JobRunner は `exportedVariables` で指定された変数を抽出し、発信 EventBridge メッセージの `detail` セクションに含めます。

#### みてきた内容をまとめる

さまざまな部分を個別に見てきましたが、ここでまとめましょう。 `/lib` ディレクトリーに `app-plane.ts` という新しいファイルを作成し、次の内容を貼り付けてください。

```typescript
import { CoreApplicationPlane, DetailType, EventManager } from '@cdklabs/sbt-aws';
import * as cdk from 'aws-cdk-lib';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';

export interface AppPlaneProps extends cdk.StackProps {
  eventBusArn: string;
}
export class AppPlaneStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: AppPlaneProps) {
    super(scope, id, props);
    const provisioningJobRunnerProps = {
      name: 'provisioning',
      permissions: PolicyDocument.fromJson(
        JSON.parse(`
{
  "Version":"2012-10-17",
  "Statement":[
      {
        "Action":[
            "cloudformation:CreateStack",
            "cloudformation:DescribeStacks",
            "s3:CreateBucket"
        ],
        "Resource":"*",
        "Effect":"Allow"
      }
  ]
}
`)
      ),
      script: `
echo "starting..."

# この template.json はここで作成されていますが、
# S3 バケットから取得することも可能です。
cat > template.json << EndOfMessage
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": { "MyBucket":{ "Type": "AWS::S3::Bucket" }},
  "Outputs": { "S3Bucket": { "Value": { "Ref": "MyBucket" }}}
}
EndOfMessage

echo "tenantId: $tenantId"
echo "tier: $tier"

aws cloudformation create-stack --stack-name "tenantTemplateStack-\${tenantId}"  --template-body "file://template.json"
aws cloudformation wait stack-create-complete --stack-name "tenantTemplateStack-\${tenantId}"
export tenantS3Bucket=$(aws cloudformation describe-stacks --stack-name "tenantTemplateStack-\${tenantId}" | jq -r '.Stacks[0].Outputs[0].OutputValue')
export someOtherVariable="this is a test"
echo $tenantS3Bucket

export tenantConfig=$(jq --arg SAAS_APP_USERPOOL_ID "MY_SAAS_APP_USERPOOL_ID" \
--arg SAAS_APP_CLIENT_ID "MY_SAAS_APP_CLIENT_ID" \
--arg API_GATEWAY_URL "MY_API_GATEWAY_URL" \
-n '{"userPoolId":$SAAS_APP_USERPOOL_ID,"appClientId":$SAAS_APP_CLIENT_ID,"apiGatewayUrl":$API_GATEWAY_URL}')

echo $tenantConfig

echo "done!"
`,
      postScript: '',
      importedVariables: ['tenantId', 'tier'],
      exportedVariables: ['tenantS3Bucket', 'someOtherVariable', 'tenantConfig'],
      scriptEnvironmentVariables: {
        TEST: 'test',
      },
      outgoingEvent: DetailType.PROVISION_SUCCESS,
      incomingEvent: DetailType.ONBOARDING_REQUEST,
    };

    new CoreApplicationPlane(this, 'CoreApplicationPlane', {
      eventBusArn: props.eventBusArn,
      jobRunnerPropsList: [provisioningJobRunnerProps],
    });
  }
}

```

これは長いコードに見えるかもしれませんが、それでも単一のコンストラクトで、さまざまな設定を渡しているだけです。アプリケーションプレーンを定義できたので、もう一度 bin ディレクトリーの hello-cdk.ts ファイルを開きましょう。 コメントアウトされている行をすべてコメントを外してください。最終的なファイルは次のようになります。

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ControlPlaneStack } from '../lib/control-plane';
import { AppPlaneStack } from '../lib/app-plane';

const app = new cdk.App();
const cp = new ControlPlaneStack(app, 'ControlPlaneStack', {});
const ap = new AppPlaneStack(app, 'AppPlaneStack', {
  eventBusArn: cp.eventBusArn,
});
```

保存したら、アプリケーションプレーンを含めてソリューションを再度デプロイしましょう。

```sh
npm run build
cdk deploy --all --require-approval never
```

##### デプロイのテスト

デプロイが完了したら、基本的なコントロールプレーンとアプリケーションプレーンをいくつかのテストで確認しましょう。 コントロールプレーンをデプロイしたときに、一時的な Admin クレデンシャルがメールで届いているはずです。 そのクレデンシャルを使って、以下のスクリプトでプレースホルダー ( “INSERT PASSWORD HERE” )を置き換えてください。ログインに成功すると、このスクリプトは新しいテナントをオンボーディングし、その詳細を取得します。 このスクリプトでは [JSON プロセッサの jq](https://jqlang.github.io/jq/) を使用しています。

```sh
PASSWORD="INSERT PASSWORD HERE"
# テナントへのログインが必要であれば、実際のメールアドレスに変更してください。
TENANT_EMAIL="tenant@example.com" 
CONTROL_PLANE_STACK_NAME="ControlPlaneStack"
TENANT_NAME="tenant$RANDOM"

CLIENT_ID=$(aws cloudformation describe-stacks --stack-name ControlPlaneStack --query "Stacks[0].Outputs[?OutputKey=='ControlPlaneIdpDetails'].OutputValue" | jq -r '.[0]' | jq -r '.idp.clientId')
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name ControlPlaneStack --query "Stacks[0].Outputs[?OutputKey=='ControlPlaneIdpDetails'].OutputValue" | jq -r '.[0]' | jq -r '.idp.userPoolId')
USER="admin"

# initiate-auth 実行のために必須
aws cognito-idp update-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-id "$CLIENT_ID" \
    --explicit-auth-flows USER_PASSWORD_AUTH

# パスワードリセットの要求を無効化
aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$USER" \
    --password "$PASSWORD" \
    --permanent

# ユーザー用のクレデンシャル取得
AUTHENTICATION_RESULT=$(aws cognito-idp initiate-auth \
    --auth-flow USER_PASSWORD_AUTH \
    --client-id "${CLIENT_ID}" \
    --auth-parameters "USERNAME=${USER},PASSWORD='${PASSWORD}'" \
    --query 'AuthenticationResult')

ID_TOKEN=$(echo "$AUTHENTICATION_RESULT" | jq -r '.IdToken')

CONTROL_PLANE_API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$CONTROL_PLANE_STACK_NAME" \
    --query "Stacks[0].Outputs[?contains(OutputKey,'controlPlaneAPIEndpoint')].OutputValue" \
    --output text)

DATA=$(jq --null-input \
    --arg tenantName "$TENANT_NAME" \
    --arg tenantEmail "$TENANT_EMAIL" \
    '{
  "tenantName": $tenantName,
  "email": $tenantEmail,
  "tier": "basic",
  "tenantStatus": "In progress"
}')

echo "creating tenant..."
curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA"
echo "" # 新規に行を追加

echo "retrieving tenants..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq

```

これでテナントのオンボーディングができたので、コンソールを確認してデプロイされたものを確認しましょう。

まず [DynamoDB コンソール](https://console.aws.amazon.com/dynamodbv2/home#)を開きます。 左側の [アイテムを探索] リンクをクリックすると、テーブル一覧が表示されます。 `ControlPlaneStack` で始まるテーブルを選択すると、オンボーディングしたばかりのテナントのエントリーがあるはずです。 ステータスは「in progress」になっているかもしれません。

アプリケーションプレーンと一緒に JobRunner をデプロイしたことを思い出してください。JobRunner は、CodeBuild 経由でプロビジョニングスクリプトを実行する AWS Step Function のラッパーです。コンソールの Step Functions をクリックして、Step Functions を見てみましょう（デプロイしたのと同じリージョンにいることを確認してください）。

Step Functions はまだ実行中の可能性がありますが、色々と調べてみてください。実行が終了すると、EventBridge に結果が返され、Control プレーンとのループが閉じます。

## インターフェイス定義

このセクションでは、メッセージのペイロードの簡単な説明とともに、2 つのプレーン間を通過する EventBridge メッセージについて説明します。

### イベントの概要

#### テナントのオンボーディング

コントロールプレーンは、新しいテナントをオンボーディングするたびにこのイベントをパブリッシュします。 このイベントには、アプリケーションプレーンがテナントリソースをプロビジョニングするのに必要なすべての情報が含まれている必要があります。 これには、テナント名、メールアドレス、ティアなどが含まれます。

##### サンプルのオンボーディングイベント

```json
{
    "source": "sbt-control-plane-api",
    "detail-type": "Onboarding",
    "detail": {
        "tenantId": "guid string",
        "tenantStatus": "see notes",
        "tenantName": "tenant name",
        "email": "admin@saas.com",
        "isActive": "boolean"
    }
}
```

#### オンボーディングステータス

アプリケーションプレーンは、オンボーディングの完了時にこのイベントをパブリッシュします。これは必ずしもオンボーディング要求が成功したことを意味するわけではなく、成功、失敗、またはタイムアウトの結果として完了まで実行されたことを意味することに注意してください。このイベントは、イベントパブリッシュ時のオンボーディング要求のステータスを含みます。

返却された `tenantConfig` オブジェクトは、アプリケーションプレーンのオンボーディングイベントに適した任意の情報を含むエスケープされた JSON 文字列です。 Serverless SaaS リファレンスアーキテクチャの SBT 実装では、このペイロードにテナントの Cognito ユーザープール ID、アプリケーションクライアント ID、API Gateway URL が含まれています。

テナントプロビジョニングが成功すると、Serverless SaaS リファレンスアーキテクチャは Complete を返します。

##### サンプルのオンボーディングステータスイベント

```json
{
    "source": "sbt-application-plane-api",
    "detail-type": "Onboarding",
    "detail": {
        "tenantConfig": "json string - see notes",
        "tenantStatus": "Complete",
    }
}
```

#### オフボーディング

コントロールプレーンは、テナントをオフボーディングするたびにこのイベントをパブリッシュします。 最低限、このイベントにはテナント ID やティアが含まれる必要があります。 オフボーディングは、テナントユーザーがシステムにログインできなくなるだけでなく、SBT からテナントのインフラストラクチャも削除されます。

##### サンプルのオフボーディングイベント

```json
{
    "source": "sbt-control-plane-api",
    "detail-type": "Offboarding",
    "detail": {
        "tenantId": "string",
        "tier": "string",
    }
}
```

#### オフボーディングステータス

アプリケーションプレーンは、オフボーディングが完了したらこのイベントをパブリッシュします。 オンボーディングと同様、このイベントは必ずしも成功を示すわけではなく、ステータスがイベントのペイロードに含まれています。

##### サンプルのオフボーディングステータスイベント 

```json
{
    "source": "sbt-application-plane-api",
    "detail-type": "Offboarding",
    "detail": {
        "tenantStatus": "Deleted",
    }
}
```

#### テナントの無効化

コントロールプレーンは、テナントを無効化するときにこのイベントをパブリッシュします。 SBT のコンテキストでは、無効化によりテナントユーザーがテナントアプリケーションにログインできなくなりますが、必ずしもテナントのインフラストラクチャが削除されるわけではありません。

##### サンプルのテナント無効化イベント

#### 無効化ステータス 

アプリケーションプレーンは、テナント無効化が完了したらこのイベントをパブリッシュします。 このイベントは、必ずしも無効化が成功したことを示すわけではなく、ステータスがペイロードに含まれています。 

##### サンプルの無効化ステータスイベント

#### テナントの有効化

##### サンプルのテナント有効化イベント

#### 有効化ステータスイベント

##### サンプルの有効化ステータスイベント


## 設計方針

* SaaS アプリケーションのベストプラクティスを生成するためのテンプレート化されたモデル - SBT は、ほとんどすべての SaaS アプリケーションを構築できるメンタルモデルと基盤となる実装を提供することを目指しています 
* 魅力的な加速剤 - コントロールプレーンとアプリケーションプレーンライブラリの機能と体験は、SaaS ビルダーがこれを標準化、簡素化、SaaS への道筋の加速に使用する十分な魅力があるべきです 
* スタンドアロンのフットプリント - SBT の 2 つの要素は「補完的ですが、結合はしていません。SBT は、それぞれが独立して配備・運用できるように設計されており、ビルダーは自分の用途に適した部分だけを選択できます。
* 価値を付加して邪魔にならないこと - SaaS ビルダーの継続的なイノベーションと生産性を阻害しません。実装に影響を与えるが進化の障害とならないような、適切なガイドラインと抽象化を提供します。
* オープンでコミュニティと共に構築 - SBT は開発者が存在する場所に合わせることを目指しています。プルリクエストを歓迎し、フォークは避けます。
* ビルダーへのガイドとアプローチしやすさ - SBT は、コミュニティが着想とリファレンスを得られるよう、豊富なドキュメントと例を提供します。

## 追加のドキュメントとリソース

#### テナント管理
現在、このサービスは単にアプリケーションプレーンに送信された正常なオンボーディング要求の結果を記録するだけで、今のところシンプルです。 SBT モデルでさらにリファレンスアーキテクチャを構築し続けると、テナント設定、ルーティング、ID 管理など、追加の機能が必要になる可能性があります。
#### システムユーザー管理
システムユーザーは、SaaS 環境を管理する管理ユーザーを表します。 これらのユーザーには、異なるシステムユーザーを認証し管理するための独自の ID メカニズムが必要です。 これらのユーザーのライフサイクルとネイチャーはテナントユーザーよりもはるかに単純です。 これらのユーザーはコントロールプレーンによって提供される体験を通してのみ存在し使用されるため、カスタマイズも少なく、コントロールプレーンのネイティブなツーリングやコンソールを通してアクセスされます。
#### テナントユーザー管理
すべての SaaS システムには、そのシステムのユーザーを管理する方法が必要です。 これらのユーザーは、アプリケーションプレーン内でのみ管理することも可能です。 しかし、これらの同じユーザーもオンボーディングと認証の体験の一部としてテナントに接続される必要があります。 このテナントと ID を関連付ける必要性から、テナントユーザーはコントロールプレーンの範囲内で保存および管理される必要があります。 これにより、コントロールプレーン内でユーザーをテナントに接続し、テナントコンテキストでユーザーを認証し、テナントコンテキストをアプリケーションプレーンに注入するなど、はるかに大きな自動化が可能になります。 しかし、テナントユーザー管理がコントロールプレーン内にホストされると、このサービスには、さまざまな環境におけるテナントユーザーに関連する追加の属性を管理する責任が加わります。 つまり、コントロールプレーンをサービスとして提供する場合、ビルダーがテナントユーザーの設定をより細かく制御できるよう、より大きな柔軟性とカスタマイズ性を可能にする必要があります。 実際、アプリケーションプレーンにも、このテナント管理サービスと統合するユーザーエクスペリエンスが含まれ、テナントユーザーを管理/設定できるシナリオがあるかもしれません。
#### オンボーディング
テナントオンボーディングのライフサイクル全体を管理することは、コントロールプレーンの最も重要な役割の 1 つです。このサービスは、新しいテナントの導入に関連するすべての設定とダウンストリームイベントのオーケストレーションに責任を持ちます。そのため、ここではテナント管理とテナントユーザー管理の両方との相互作用が見られます。さて、オンボーディングがさらに面白くなるのは、オンボーディングがアプリケーションプレーンとの統合にも依存している点です。各新規テナントがコントロールプレーンを介してオンボーディングされると、このサービスはアプリケーションプレーンにもイベントを送信し、テナントごとに必要となる可能性のあるアプリケーションプレーンリソース/インフラストラクチャの作成をトリガーする必要があります。ボーディング・サービスは、このアプリケーション・プロビジョニング・イベントをパブリッシュし、アプリケーションプレーンのテナントプロビジョニングライフサイクルの進捗を表すさまざまなイベントを受けられるようにしておく必要があります。
#### 請求
多くの SaaS プロバイダーは、自社のティアリングとマネタイズ戦略にマップされる課金プランを作成できる課金サービスと統合しています。 一般的なアプローチは、コントロールプレーン内に API を提供し、課金アカウントの作成 (オンボーディング) と個々のテナントの課金/消費イベントの公開に対する、汎用的なメカニズムを提供することです。 このサービスには、テナントの状態イベントを課金サービスに送受信するためのテナント管理との統合も含まれます。 例えば、テナントが無効化された場合、課金からテナント管理にトリガーが送られる可能性があります。ティアの変更もこの統合の一部となる可能性があります。

#### メトリクス
マルチテナント運用チームは、多くの場合、テナントやティアのアクティビティや消費プロファイルに関するテナント認識のインサイトが必要です。 このデータは様々な文脈で使用され、チームはパターンに基づいて運用上、ビジネス上、設計上の決定を下すことができます。これらのパターンは、アプリケーションティアから公開されるメトリクスを通して観察できるはずです。 コントロールプレーンは、これらのメトリクスイベントを受け入れるための標準化されたメトリクス API を提供します。 また、テナントおよびティアのコンテキストを伝える方法に関して、ある程度の標準化を行いながら、ビルダーがカストムイベントを定義できるようにします。 これらのメトリクスはすべてコントロールプレーンで集約され、コントロールプレーン管理コンソールのダッシュボードに表示されます。また、他の分析ツールにメトリクスデータを取り込むサポートも提供される可能性があります。
#### ティアリング
ティアリングはコントロールプレーン内の非常に基本的な構成要素です。 しかし、SaaS 環境のティアリング設定に対する、一元化された中央リポジトリを提供する必要があります。 これにより、アプリケーションプレーンとコントロールプレーンの間で、テナントとティアの間のマッピングについて明確な合意点ができます。このマッピングは、コントロールプレーンの内外の多くの体験で使用されます。
