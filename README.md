# OrgaSound

OrgaSoundは[Angular CLI](https://github.com/angular/angular-cli) version 6.2.2で作成されています。</br>
バックエンドについては、firebaseを使用しています。</br>
また、OrgaSoundはAngular 4で作成されている[BaseChat](https://github.com/wesdoyle/base-chat)を基に作成しています。

## 主な機能

 - ログイン、サインアップ</br>
 firebaseのパスワード認証サービスを用いてアカウント作成及びログインを行います。
 
 - 音楽ファイル再生機能</br>
 firebaseのストレージに格納した音声ファイル名(ソースではoggファイルのみを対象)を入力すると、ファイルを再生します。
 
 - 音量調整</br>
 スライダーを動かすことで再生時の音量を調整することが出来ます。

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
