<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>订阅成功</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'PingFang SC','Microsoft YaHei',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <!-- Logo -->
    <tr><td style="padding-bottom:24px;text-align:center;">
        <span style="font-size:22px;font-weight:700;color:#18181b;">{{$name}}</span>
    </td></tr>
    <!-- Card -->
    <tr><td style="background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;padding:40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="font-size:22px;font-weight:700;color:#18181b;padding-bottom:8px;">订阅成功，欢迎使用！</td></tr>
            <tr><td style="font-size:15px;color:#52525b;line-height:1.7;padding-bottom:8px;">您已成功订阅 <strong style="color:#18181b;">{{$plan_name}}</strong>（流量 {{$transfer}}），套餐已生效。</td></tr>
            <tr><td style="font-size:15px;color:#52525b;line-height:1.7;padding-bottom:28px;">按下面三步操作，几分钟就能用上：</td></tr>

            <!-- Step 1 -->
            <tr><td style="padding-bottom:20px;">
                <div style="font-size:16px;font-weight:700;color:#18181b;padding-bottom:6px;">第一步：获取订阅链接</div>
                <div style="font-size:14px;color:#52525b;line-height:1.7;">登录商城，在仪表盘找到「复制订阅链接」，点一下即可复制。订阅链接是您专属的，请勿分享给他人。</div>
            </td></tr>
            <!-- Step 2 -->
            <tr><td style="padding-bottom:20px;">
                <div style="font-size:16px;font-weight:700;color:#18181b;padding-bottom:6px;">第二步：下载客户端 App</div>
                <div style="font-size:14px;color:#52525b;line-height:1.7;">根据您的设备选择一个下载：</div>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
                    <tr>
                        <td style="font-size:14px;color:#52525b;padding:6px 0;border-bottom:1px solid #f4f4f5;">iPhone / iPad</td>
                        <td style="font-size:14px;padding:6px 0;border-bottom:1px solid #f4f4f5;text-align:right;"><a href="https://apps.apple.com/us/app/shadowrocket/id932747118" style="color:#C9A227;text-decoration:none;font-weight:600;">Shadowrocket（App Store，约 18 元）</a></td>
                    </tr>
                    <tr>
                        <td style="font-size:14px;color:#52525b;padding:6px 0;border-bottom:1px solid #f4f4f5;">安卓</td>
                        <td style="font-size:14px;padding:6px 0;border-bottom:1px solid #f4f4f5;text-align:right;"><a href="https://github.com/chen08209/FlClash/releases" style="color:#C9A227;text-decoration:none;font-weight:600;">FlClash（免费）</a></td>
                    </tr>
                    <tr>
                        <td style="font-size:14px;color:#52525b;padding:6px 0;border-bottom:1px solid #f4f4f5;">Windows</td>
                        <td style="font-size:14px;padding:6px 0;border-bottom:1px solid #f4f4f5;text-align:right;"><a href="https://github.com/clash-verge-rev/clash-verge-rev/releases" style="color:#C9A227;text-decoration:none;font-weight:600;">Clash Verge（免费）</a></td>
                    </tr>
                    <tr>
                        <td style="font-size:14px;color:#52525b;padding:6px 0;">Mac</td>
                        <td style="font-size:14px;padding:6px 0;text-align:right;"><a href="https://github.com/clash-verge-rev/clash-verge-rev/releases" style="color:#C9A227;text-decoration:none;font-weight:600;">Clash Verge（免费）</a></td>
                    </tr>
                </table>
            </td></tr>
            <!-- Step 3 -->
            <tr><td style="padding-bottom:20px;">
                <div style="font-size:16px;font-weight:700;color:#18181b;padding-bottom:6px;">第三步：导入订阅，开始使用</div>
                <div style="font-size:14px;color:#52525b;line-height:1.7;">打开客户端，把复制好的订阅链接粘贴进去导入，选一个节点，打开开关即可。详细图文教程在商城「使用教程」里，按您的设备类型查看。</div>
            </td></tr>

            <tr><td style="font-size:14px;color:#52525b;line-height:1.7;padding-bottom:8px;">小提示：国内网站和 App 会自动直连，不走代理，速度不受影响；节点连不上时，先刷新一次订阅再试，仍不行请提交工单或联系客服。</td></tr>
            <tr><td style="font-size:14px;color:#52525b;line-height:1.7;padding-bottom:28px;">有任何问题，回复这封邮件或在商城提交工单，我们会尽快帮您解决。</td></tr>
            <tr><td align="center">
                <a href="{{$url}}" style="display:inline-block;background:#C9A227;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">前往商城</a>
            </td></tr>
        </table>
    </td></tr>
    <!-- Footer -->
    <tr><td style="padding-top:24px;text-align:center;">
        <a href="{{$url}}" style="font-size:13px;color:#a1a1aa;text-decoration:none;">{{$url}}</a>
        <p style="font-size:12px;color:#d4d4d8;margin:8px 0 0;">此邮件由系统自动发送，请勿直接回复（回复请使用客服邮箱或商城工单）。</p>
    </td></tr>
</table>
</td></tr>
</table>
</body>
</html>
