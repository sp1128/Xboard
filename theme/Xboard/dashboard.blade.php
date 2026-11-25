<!doctype html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>{{$title}}</title>
  <link rel="stylesheet" href="/theme/{{$theme}}/assets/ios-app.css?v={{ urlencode($version) }}" />
</head>

<body class="sl-ios-body">
  <script>
    window.routerBase = "/";
    window.settings = {
      title: @json($title),
      assets_path: '/theme/{{$theme}}/assets',
      theme: {
        color: '{{ $theme_config['theme_color'] ?? "default" }}'
      },
      version: @json($version),
      background_url: @json($theme_config['background_url'] ?? ''),
      description: @json($description),
      i18n: ['zh-CN', 'en-US', 'ja-JP', 'vi-VN', 'ko-KR', 'zh-TW', 'fa-IR'],
      logo: @json($logo)
    };
  </script>
  <div id="app"></div>
  <script src="/theme/{{$theme}}/assets/ios-qr.js?v={{ urlencode($version) }}"></script>
  <script src="/theme/{{$theme}}/assets/ios-app.js?v={{ urlencode($version) }}"></script>
  {!! $theme_config['custom_html'] ?? '' !!}
</body>

</html>
