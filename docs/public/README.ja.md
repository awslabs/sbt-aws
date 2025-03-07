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

このセクションでは、SBT の(私たちが現時点で想定している)すべての可変要素の責務を詳しく説明し、新しい開発者がスピードを上げる基盤を提供します。 明らかに SBT はまだ開発中であり、その設計はほぼ毎日行われているタスクによって形作られ、影響を受けています。 この分野での理解が深まるに従い、このドキュメンテーションを最新で関連性のあるものに保つよう努めます。

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

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 3, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc,
    });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
      cluster: cluster, // Required
      cpu: 512, // Default is 256
      desiredCount: 6, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
      memoryLimitMiB: 2048, // Default is 512
      publicLoadBalancer: true, // Default is false
    });
  }
}
```

Typescript に馴染みがない人でも、この部分が何を行っているかは推測できるかもしれません。 簡単に説明すると、このコードでは、新規に作成した VPC 内に ECS クラスターを用意し、負荷分散された Fargate タスクをサービスでラップして作成しています。 CDK は、この数行の TypeScript コードを "synthesizing" というプロセスを通じて、 500 行以上の CloudFormation へ展開できます。

この例に出てくるオブジェクトは CDK チームによって作成されました。 具体的には、コード内の vpc、cluster、ApplicationLoadBalancedFargateService です。 CDK では、これらのオブジェクトをコンストラクトと呼んでいます。 CDK の内部では、独自のコンストラクトを作成するためのツールと抽象化が提供されています。 一部のコンストラクトは CloudFormation のタイプと 1 対 1 の対応関係がありますが、他のコンストラクトはより高機能です (上の例の ECS サービスなど)。

### チュートリアル

> [!WARNING]
> このチュートリアルを実行すると、AWS アカウントで料金が発生する可能性があります。

前述の通り、SBT は CDK を利用して構築されています。 その使用例を示すため、まず CDK の入門ガイドに従って新しい CDK アプリケーションを初期化してください。 ガイドは[こちら](https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html#hello_world_tutorial_create_app)にあります。 hello cdk チュートリアルのステップ 1 まで完了してから、ここに戻って SBT の作業を続けてください。 サンプルアプリを構築やデプロイする必要はありません。

新しい CDK アプリが初期化できたら、SBT コンポーネントをインストールしましょう。 `hello-cdk` ディレクトリー内で次のコマンドを実行してください。

```sh
npm install @cdklabs/sbt-aws
```

#### コントロールプレーン

SBT がインストールできたので、新しい SBT コントロールプレーンを作成しましょう。 `lib/control-plane.ts` という新しいファイルを作成し、次の内容を記入してください。 メールアドレスは、一時的な管理者パスワードを受け取るためのものなので、実際のメールアドレスに置き換えてください。

```typescript
import * as sbt from '@cdklabs/sbt-aws';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ControlPlaneStack extends Stack {
  public readonly regApiGatewayUrl: string;
  public readonly eventManager: sbt.IEventManager;

  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id, props);
    const cognitoAuth = new sbt.CognitoAuth(this, 'CognitoAuth', {
      enableAdvancedSecurityMode: false, // only for testing purposes!
      setAPIGWScopes: false, // only for testing purposes!
    });

    const controlPlane = new sbt.ControlPlane(this, 'ControlPlane', {
      auth: cognitoAuth,
      systemAdminEmail: 'ENTER YOUR EMAIL HERE',
    });

    this.eventManager = controlPlane.eventManager;
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
const controlPlaneStack = new ControlPlaneStack(app, 'ControlPlaneStack');
// const appPlaneStack = new AppPlaneStack(app, 'AppPlaneStack', {
//   eventManager: controlPlaneStack.eventManager,
// });
```

コメントアウトされた数行は、後でアプリケーションプレーンを説明する際に戻って触れます。 すべてを保存したら、hello-cdk プロジェクトのルートから次のコマンドを実行してください。

> [!WARNING]
> ControlPlane が Lambda 関数 をデプロイするため、Docker がインストールされている必要があります。

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
export interface AppPlaneProps extends cdk.StackProps {
  eventManager: sbt.IEventManager;
}

export class ApplicationPlaneStack extends Stack {
  constructor(scope: Construct, id: string, props: AppPlaneProps) {
    super(scope, id, props);

    new sbt.CoreApplicationPlane(this, 'CoreApplicationPlane', {
      eventManager: props.eventManager,
      scriptJobs: [],
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
const scriptJobProps: TenantLifecycleScriptJobProps = {
  permissions: PolicyDocument.fromJson(/*See below*/),
  script: '' /*See below*/,
  environmentStringVariablesFromIncomingEvent: ['tenantId', 'tier'],
  environmentVariablesToOutgoingEvent: ['tenantS3Bucket', 'someOtherVariable', 'tenantConfig'],
  scriptEnvironmentVariables: {
    TEST: 'test',
  },
  eventManager: eventManager /*See below on how to create EventManager*/,
};
```

##### Bash ジョブランナープロパティ

このオブジェクトを詳しく見ていきましょう。

| キー                           | タイプ                                                                                                | 用途                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **name**                       | string                                                                                                | name キーはこのジョブの名前です                                             |
| **script**                     | string                                                                                                | 実行されるジョブを表す Bash スクリプト形式の文字列 (以下に例があります)     |
| **permissions**                | [PolicyDocument](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.PolicyDocument.html) | このジョブが要求されたタスクを実行するために必要な IAM ポリシードキュメント |
| **postScript**                 | string                                                                                                | メインスクリプトが完了した後に実行される Bash スクリプト                    |
| **importedVariables**          | string[]                                                                                              | イベントの詳細フィールドから BashJobRunner にインポートする環境変数         |
| **exportedVariables**          | string[]                                                                                              | BashJobRunner が完了したら、送信イベントにエクスポートする環境変数          |
| **scriptEnvironmentVariables** | `{ [key: string]: string }`                                                                           | codebuild BashJobRunner に渡す変数                                          |
| **outgoingEvent**              | any                                                                                                   | EventBridgeに送信するイベント情報                                           |
| **incomingEvent**              | any                                                                                                   | EventBridgeから受信するイベント情報                                         |

ジョブランナーの本質的な部分は、`script` キーの値にあります。 この特定の例がプロビジョニング用であり、また SaaS アプリケーションが各テナントに S3 バケットを 1 つプロビジョニングするだけだということを思い出してください。 その例のプロビジョニングスクリプトを見てみましょう。

```sh
echo "starting..."

# note that this template.json is being created here, but
# it could just as easily be pulled in from an S3 bucket.
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
export tenantStatus="created"

echo "done!"
```

このスクリプトをセクションごとに分解していきましょう。

---

###### CloudFormation テンプレート

最初の数行には、S3 バケットを含むサンプルの AWS CloudFormation テンプレートが含まれています。

```sh
# note that this template.json is being created here, but
# it could just as easily be pulled in from an S3 bucket.
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

これらの変数がどのように設定されるかを確認してみましょう。 `JobRunner` は内部的に [AWS CodeBuild](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/welcome.html) プロジェクトを作成することを思い出してください。 `JobRunner` が CodeBuild プロジェクトを作成するとき、どの環境変数を提供するかを指定できます。 また、`JobRunner` ユーティリティは、`incomingEvent` パラメータで指定された条件を満たす EventBridge メッセージによって起動されることを思い出してください。EventBridge を介して到着するメッセージには、送信者 (この場合はコントロールプレーン) が含めたコンテキスト情報を持つ `detail` JSON オブジェクトがあります (ドキュメントは[こちら](https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-events-structure.html))。 `importedVariables` の各キーに対して、`JobRunner` は EventBridge メッセージの `detail` JSON オブジェクトから一致するキーの値を取得し、その値を環境変数として CodeBuild プロジェクトに提供します。

例えば、次のようなプロビジョニングメッセージがコントロールプレーンから EventBridge 経由で送信された場合を考えてみましょう。

```json
{
  "version": "0",
  "id": "6a7e8feb-b491-4cf7-a9f1-bf3703467718",
  "detail-type": "onboardingRequest",
  "source": "controlPlaneEventSource",
  "account": "111122223333",
  "time": "2017-12-22T18:43:48Z",
  "region": "us-west-1",
  "resources": ["arn:aws:ec2:us-west-1:123456789012:instance/i-1234567890abcdef0"],
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
export tenantStatus="created"
```

`importedVariables` に対して実行したのと同様に、JobRunner は `exportedVariables` で指定された変数を抽出し、発信 EventBridge メッセージの `detail` セクションに含めます。

#### みてきた内容をまとめる

さまざまな部分を個別に見てきましたが、ここでまとめましょう。 `/lib` ディレクトリーに `app-plane.ts` という新しいファイルを作成し、次の内容を貼り付けてください。

```typescript
import * as sbt from '@cdklabs/sbt-aws';
import * as cdk from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { PolicyDocument, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export interface AppPlaneProps extends cdk.StackProps {
  eventManager: sbt.IEventManager;
}
export class AppPlaneStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: AppPlaneProps) {
    super(scope, id, props);
    const deprovisioningScriptJobProps: sbt.TenantLifecycleScriptJobProps = {
      permissions: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: [
              'cloudformation:DeleteStack',
              'cloudformation:DescribeStacks',
              's3:DeleteBucket',
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
          }),
        ],
      }),
      script: `
echo "starting..."

echo "tenantId: $tenantId"

aws cloudformation delete-stack --stack-name "tenantTemplateStack-\${tenantId}"
aws cloudformation wait stack-delete-complete --stack-name "tenantTemplateStack-\${tenantId}"
export status="deleted stack: tenantTemplateStack-\${tenantId}"
export registrationStatus="deleted"
echo "done!"
`,
      environmentStringVariablesFromIncomingEvent: ['tenantId'],
      environmentVariablesToOutgoingEvent: {
        tenantRegistrationData: ['registrationStatus'],
      },
      eventManager: props.eventManager,
    };

    const provisioningScriptJobProps: sbt.TenantLifecycleScriptJobProps = {
      permissions: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: [
              'cloudformation:CreateStack',
              'cloudformation:DescribeStacks',
              's3:CreateBucket',
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
          }),
        ],
      }),
      script: `
echo "starting..."

# note that this template.yaml is being created here, but
# it could just as easily be pulled in from an S3 bucket.
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
export tenantStatus="created"

echo "done!"
`,
      environmentStringVariablesFromIncomingEvent: ['tenantId', 'tier'],
      environmentVariablesToOutgoingEvent: {
        tenantData: ['tenantS3Bucket', 'tenantConfig', 'someOtherVariable', 'tenantStatus'],
        tenantRegistrationData: ['registrationStatus'],
      },
      scriptEnvironmentVariables: {
        TEST: 'test',
      },
      eventManager: props.eventManager,
    };

    const provisioningJobScript: sbt.ProvisioningScriptJob = new sbt.ProvisioningScriptJob(
      this,
      'provisioningJobScript',
      provisioningScriptJobProps
    );

    const deprovisioningJobScript: sbt.DeprovisioningScriptJob = new sbt.DeprovisioningScriptJob(
      this,
      'deprovisioningJobScript',
      deprovisioningScriptJobProps
    );

    new sbt.CoreApplicationPlane(this, 'CoreApplicationPlane', {
      eventManager: props.eventManager,
      scriptJobs: [provisioningJobScript, deprovisioningJobScript],
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
const controlPlaneStack = new ControlPlaneStack(app, 'ControlPlaneStack');
const appPlaneStack = new AppPlaneStack(app, 'AppPlaneStack', {
  eventManager: controlPlaneStack.eventManager,
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
PASSWORD='INSERT PASSWORD HERE'
# Change this to a real email if you'd like to log into the tenant
TENANT_EMAIL="tenant@example.com"
CONTROL_PLANE_STACK_NAME="ControlPlaneStack"
TENANT_NAME="tenant$RANDOM"

CLIENT_ID=$(aws cloudformation describe-stacks \
  --stack-name "$CONTROL_PLANE_STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='ControlPlaneIdpClientId'].OutputValue" \
  --output text)

USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name "$CONTROL_PLANE_STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='ControlPlaneIdpUserPoolId'].OutputValue" \
  --output text)

USER="admin"

# required in order to initiate-auth
aws cognito-idp update-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-id "$CLIENT_ID" \
    --explicit-auth-flows USER_PASSWORD_AUTH > /dev/null

# remove need for password reset
aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$USER" \
    --password "$PASSWORD" \
    --permanent

# get credentials for user
AUTHENTICATION_RESULT=$(aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id "${CLIENT_ID}" \
  --auth-parameters "USERNAME='${USER}',PASSWORD='${PASSWORD}'" \
  --query 'AuthenticationResult')

ACCESS_TOKEN=$(echo "$AUTHENTICATION_RESULT" | jq -r '.AccessToken')

CONTROL_PLANE_API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$CONTROL_PLANE_STACK_NAME" \
    --query "Stacks[0].Outputs[?contains(OutputKey,'controlPlaneAPIEndpoint')].OutputValue" \
    --output text)

DATA=$(jq --null-input \
    --arg tenantName "$TENANT_NAME" \
    --arg tenantEmail "$TENANT_EMAIL" \
    '{
      "tenantData": {
        "tenantName": $tenantName,
        "email": $tenantEmail,
        "tier": "basic"
        },
      "tenantRegistrationData": {
        "registrationStatus": "In progress"
      }
}')

echo "creating tenant..."
CREATION_RESPONSE=$(curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenant-registrations" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA")

echo "$CREATION_RESPONSE" | jq
echo "" # add newline

# Extract both IDs from the creation response
TENANT_ID=$(echo "$CREATION_RESPONSE" | jq -r '.data.tenantId')
TENANT_REGISTRATION_ID=$(echo "$CREATION_RESPONSE" | jq -r '.data.tenantRegistrationId')

# Function to check tenant status
check_tenant_status() {
    local status=$(curl --silent \
        --url "${CONTROL_PLANE_API_ENDPOINT}tenant-registrations" \
        --header "Authorization: Bearer ${ACCESS_TOKEN}" \
        | jq -r ".data[] | select(.tenantId == \"$TENANT_ID\") | .registrationStatus")
    echo "$status"
}

# Wait for tenant to be fully provisioned
echo "waiting for tenant to be fully provisioned..."
while true; do
    STATUS=$(check_tenant_status)
    echo "Current status: $STATUS"
    if [ "$STATUS" = "" ]; then
        echo "Tenant provisioning completed"
        break
    elif [ "$STATUS" = "In progress" ]; then
        echo "Still provisioning... waiting 10 seconds"
        sleep 10
    else
        echo "Unexpected status: $STATUS"
        exit 1
    fi
done

echo "deleting tenant..."
curl --request DELETE \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenant-registrations/${TENANT_REGISTRATION_ID}" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --header 'content-type: application/json' | jq

echo "verifying deletion..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenant-registrations" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
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

コントロール・プレーンは、新しいテナントをオンボードするたびに、このイベントを発行します。このイベントには、テナント作成リクエスト（POST /tenants）に含まれるすべての情報と、テナント管理サービスによって追加されたフィールドが含まれます。上記の場合、オンボーディング・イベントは次のようになります：

##### サンプルのオンボーディングイベント

```json
{
  "source": "controlPlaneEventSource",
  "detail-type": "onboardingRequest",
  "detail": {
    "tenantId": "guid string",
    "tenantName": "tenant$RANDOM",
    "email": "tenant@example.com",
    "tier": "basic",
    "tenantStatus": "In progress"
  }
}
```

#### テナント・プロビジョンの成功

設定に従って、アプリケーションプレーンはオンボーディングの完了時にこのイベントを発行する。このイベントには、`tenantId` と、`environmentVariablesToOutgoingEvent` パラメータで指定した環境変数（キーと値のペア）を含む `jobOutput` オブジェクトが含まれる。上記の例では、プロビジョニング成功イベントは以下のようになります：

##### プロビジョニング成功イベントのサンプル

```json
{
  "source": "applicationPlaneEventSource",
  "detail-type": "provisionSuccess",
  "detail": {
    "jobOutput": {
      "tenantStatus": "created",
      "tenantConfig": "{\n  \"userPoolId\": \"MY_SAAS_APP_USERPOOL_ID\",\n  \"appClientId\": \"MY_SAAS_APP_CLIENT_ID\",\n  \"apiGatewayUrl\": \"MY_API_GATEWAY_URL\"\n}",
      "tenantName": "tenant$RANDOM",
      "tenantS3Bucket": "mybucket",
      "someOtherVariable": "this is a test",
      "email": "tenant@example.com"
    },
    "tenantId": "guid string"
  }
}
```

#### テナントプロビジョニング成功

設定に従って、アプリケーションプレーンはオンボーディングの完了時にこのイベントを発行します。このイベントには、`tenantId`と、`environmentVariablesToOutgoingEvent`パラメータで指定されたキーを持つ環境変数（キー/値ペア）を含む`jobOutput`オブジェクトが含まれています。上記の例では、プロビジョニング成功イベントは次のようになります。

##### サンプルのプロビジョニング成功イベント

```json
{
  "source": "applicationPlaneEventSource",
  "detail-type": "provisionSuccess",
  "detail": {
    "jobOutput": {
      "tenantStatus": "created",
      "tenantConfig": "{\n  \"userPoolId\": \"MY_SAAS_APP_USERPOOL_ID\",\n  \"appClientId\": \"MY_SAAS_APP_CLIENT_ID\",\n  \"apiGatewayUrl\": \"MY_API_GATEWAY_URL\"\n}",
      "tenantName": "tenant$RANDOM",
      "tenantS3Bucket": "mybucket",
      "someOtherVariable": "this is a test",
      "email": "tenant@example.com"
    },
    "tenantId": "guid string"
  }
}
```

#### テナントオフボーディングリクエスト

コントロール・プレーンはテナントをオフボーディングするたびにこのイベントを発行する。このイベントの詳細には、テナントオブジェクト全体（つまり、テナント作成リクエストで定義されたフィールドと `tenantId` などのフィールド）が含まれます。上記で定義したオンボーディングジョブと同様に、オフボーディングは、テナントの専用インフラストラクチャの削除を含むがこれに限定されない、アプリケーションが必要とするものであれば何でも可能です。

##### オフボーディングリクエストイベントのサンプル

```json
{
  "source": "controlPlaneEventSource",
  "detail-type": "offboardingRequest",
  "detail": {
    // <entire tenant object>
  }
}
```

#### テナントデプロビジョンの成功

アプリケーション・プレーンは、テナントのデプロビジョニングが正常に完了すると、このイベントを発行します。このイベントには、ソース、詳細タイプ、およびデプロビジョニング・プロセスに関与したリソースを含む、標準の EventBridge メタデータが含まれます。イベントの詳細セクションには、tenantData（通常、デプロビジョニング後は空）と、最終的な登録ステータスを含むtenantRegistrationData、およびオフボーディングされたテナントのtenantRegistrationIdを含むjobOutputオブジェクトが含まれます。jobOutputの具体的な内容は、デプロビジョニング・ジョブの構成とenvironmentVariablesToOutgoingEventパラメータによって決定されるため、全体的に一貫した形式を維持しながら、含まれる情報に柔軟性を持たせることができます。このイベントは、テナントに必要なすべてのクリーンアップとデプロビジョニング・アクションが完了したことを確認する役割を果たします。

#### デプロビジョンの成功イベントのサンプル

```json
{
  "version": "0",
  "id": "guid-string",
  "detail-type": "deprovisionSuccess",
  "source": "applicationPlaneEventSource",
  "account": "account-id",
  "time": "timestamp",
  "region": "region",
  "resources": [
    "arn:aws:states:region:account-id:stateMachine:deprovisioningJobScriptprovisioningStateMachine-id",
    "arn:aws:states:region:account-id:execution:deprovisioningJobScriptprovisioningStateMachine-id:execution-id"
  ],
  "detail": {
    "jobOutput": {
      "tenantData": {},
      "tenantRegistrationData": {
        "registrationStatus": "deleted"
      }
    },
    "tenantRegistrationId": "registration-guid-string"
  }
}
```

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

### AWS Marketplace との統合

SaaS Builder Toolkit は、SaaS アプリケーションと AWS Marketplace との統合を簡素化するためのコンストラクトを提供します。AWSMarketplaceSaaSProduct` コンストラクトは、登録 API、サブスクライバ情報を格納するための DynamoDB テーブル、サブスクリプションとエンタイトルメントイベントを処理するために必要な AWS Lambda 関数とイベントソースを含む、AWS Marketplace SaaS プロダクトを作成できます。

ツールキットには `SampleRegistrationWebPage` コンストラクトも含まれており、Amazon S3 にホストされ、Amazon CloudFront によってフロントされるサンプル登録 Web ページが作成される。このWebページには、ユーザがSaaS製品に登録するための動的なフォームが含まれており、登録に必要なフィールドはコンストラクトのpropとして指定される。

さらに、ツールキットは、AWS Marketplaceからのサブスクリプションイベントの処理、使用量の計測、サブスクリプションステータスに基づく製品へのアクセスの許可または取り消しなど、エンタイトルメントとサブスクリプションロジックを管理するためのユーティリティを提供します。

これらのコンストラクトとユーティリティを活用することで、SaaS アプリケーションと AWS Marketplace の統合プロセスを合理化し、Marketplace の要件への準拠を保証し、顧客にシームレスな登録とサブスクリプションのエクスペリエンスを提供することができます。

詳細については、[AWS Marketplace Integration](/docs/public/marketplace-integration.md) を参照してください。
