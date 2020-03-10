# JuruSuke3

> JuruSuke3 Timetable collaborator. 
2020/3/10 
Nuxt firebase SPA仕様です。
http://jurusuke3.web.app/

現在読み込んでいるライブラリは

■Vue cal(分単位を扱えるが、モバイルや遅延機能の付け足しが難しいかもしれない。)
https://antoniandre.github.io/vue-cal/

■vue-datetime(yyyy-MM-dd HH:mm形式で取得するため)
https://www.npmjs.com/package/vue-datetime


まだまだ表面上で、見た目を作っている状態です。
ファイルのディレクトリは後ほど整理しますが、イベント登録後にTimeTableのページが制作される構想です。今はすぐに確認できるようにメニューからのアクセスにしています。

==========================-
サイトの構想(POC)

「調整さん」のような感じでLine上で最初の一人がイベント作成し、URLをシェア。
以降はイベント1日の単位表示で、全員が編集閲覧可能。分単位のイベント進行を把握でき、また、遅延情報がわかりやすく表示できる形を目指しています。

ログインなどの機能を省いてできるだけ簡単に制作表示拡散できるPOC


基本PWA方向に行きたいです。

index.vue でイベントの題名とイベント開催yyyy-MM-dd HH:mmを取得し、TimeTable.vueをジェネレイト。チャットで言うところのルームを制作。

TimeTable.vueでは、indexで取得した、yyyy-MM-dd HH:mmのDay scheduleを表示。Toolbarのシェアボタンより、ルームURLをシェアし、複数人で閲覧、編集が可能にしていきたいです。

タスク追加ボタンより順次スケジュールを追加していきたいです。

また大きな問題として、遅延情報を追加するボタンとJsonの情報変更をどのようにやるかがまだ見えていない部分です。

そのほか、アクセス解析に必要なものを埋め込む必要があります。

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
