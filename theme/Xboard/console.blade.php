{{-- 控制台（原 SPA，assets/umi.js）样式层：只改外观，不注入 DOM、不改业务逻辑。
     布局参考聚盟云控制台：白色侧栏 + 分组菜单、浅灰内容区、细边框白卡片、#165dff 主色。
     依赖 Naive UI 类名与 .cus-scroll-y 容器，升级 umi.js 后需要回归检查。 --}}
<style id="sl-console">
:root{--sl-primary:#165dff;--sl-primary-hi:#4080ff;--sl-primary-soft:#e8f3ff;--sl-bg:#f7f8fa;--sl-surface:#fff;--sl-line:#e5e6eb;--sl-text:#1d2129;--sl-muted:#86909c;--sl-radius:8px}
html.dark{--sl-primary-soft:rgba(22,93,255,.16);--sl-bg:#17171a;--sl-surface:#232324;--sl-line:#333335;--sl-text:#f2f3f5;--sl-muted:#8a8f99}

/* 主色：Naive UI 把颜色写在组件行内变量上，只能逐个覆盖。不加 #app 前缀，弹窗、抽屉、下拉菜单渲染在 body 下也能生效 */
.color-primary{color:var(--sl-primary)!important}
.n-button--primary-type:not(.n-button--secondary):not(.n-button--tertiary):not(.n-button--quaternary):not(.n-button--ghost):not(.n-button--text){--n-color:var(--sl-primary)!important;--n-color-hover:var(--sl-primary-hi)!important;--n-color-focus:var(--sl-primary-hi)!important;--n-color-pressed:#0e42d2!important;--n-border:1px solid var(--sl-primary)!important;--n-border-hover:1px solid var(--sl-primary-hi)!important;--n-border-focus:1px solid var(--sl-primary-hi)!important;--n-border-pressed:1px solid #0e42d2!important;--n-ripple-color:var(--sl-primary)!important}
.n-button--primary-type:is(.n-button--secondary,.n-button--tertiary,.n-button--quaternary,.n-button--ghost,.n-button--text){--n-text-color:var(--sl-primary)!important;--n-text-color-hover:var(--sl-primary-hi)!important;--n-text-color-pressed:var(--sl-primary)!important;--n-text-color-focus:var(--sl-primary-hi)!important;--n-border:1px solid var(--sl-primary)!important;--n-border-hover:1px solid var(--sl-primary-hi)!important}
.n-button--primary-type.n-button--secondary{--n-color:var(--sl-primary-soft)!important;--n-color-hover:var(--sl-primary-soft)!important;--n-color-pressed:var(--sl-primary-soft)!important;--n-color-focus:var(--sl-primary-soft)!important;--n-border:none!important;--n-border-hover:none!important}
.n-button{--n-border-radius:6px!important}
.n-progress{--n-fill-color:var(--sl-primary)!important}
.n-tabs{--n-bar-color:var(--sl-primary)!important;--n-tab-text-color-active:var(--sl-primary)!important;--n-tab-text-color-hover:var(--sl-primary)!important}
.n-radio-group,.n-radio{--n-button-border-color-active:var(--sl-primary)!important;--n-button-text-color-active:var(--sl-primary)!important;--n-button-box-shadow-focus:none!important;--n-dot-color-active:var(--sl-primary)!important;--n-box-shadow-active:inset 0 0 0 1px var(--sl-primary)!important}
.n-input,.n-base-selection{--n-border-hover:1px solid var(--sl-primary-hi)!important;--n-border-focus:1px solid var(--sl-primary)!important;--n-caret-color:var(--sl-primary)!important;--n-border-radius:6px!important}
.n-switch{--n-rail-color-active:var(--sl-primary)!important}
.n-checkbox{--n-color-checked:var(--sl-primary)!important;--n-border-checked:1px solid var(--sl-primary)!important}
.n-pagination{--n-item-text-color-active:var(--sl-primary)!important;--n-item-border-active:1px solid var(--sl-primary)!important}

/* 侧栏：白底、分组小标题、浅蓝选中态 */
#app .n-layout-sider{background:var(--sl-surface)!important}
#app .n-layout-sider__border{background:var(--sl-line)!important}
#app .n-layout-sider .h-15{justify-content:flex-start;padding-left:20px;height:56px;border-bottom:1px solid var(--sl-line)}
#app .n-layout-sider .title-text{display:flex;align-items:center;gap:8px;margin:0;font-size:16px;color:var(--sl-text)!important}
#app .n-layout-sider .title-text:before{content:"✦";display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:var(--sl-primary);color:#fff;font-size:13px;font-weight:400}
#app .side-menu{padding:8px 8px 16px}
#app .n-menu{--n-item-height:38px!important;--n-border-radius:6px!important;--n-item-text-color:var(--sl-text)!important;--n-item-icon-color:var(--sl-muted)!important;--n-item-color-hover:var(--sl-bg)!important;--n-item-color-active:var(--sl-primary-soft)!important;--n-item-color-active-hover:var(--sl-primary-soft)!important;--n-item-text-color-active:var(--sl-primary)!important;--n-item-text-color-active-hover:var(--sl-primary)!important;--n-item-icon-color-active:var(--sl-primary)!important;--n-item-icon-color-active-hover:var(--sl-primary)!important;--n-group-text-color:var(--sl-muted)!important;font-size:14px}
#app .n-menu .n-menu-item{margin-top:2px}
#app .n-menu .n-menu-item-content:before{left:0!important;right:0!important}
#app .n-menu .n-menu-item-content--selected{font-weight:500}
#app .n-menu .n-menu-item-content--selected a{color:var(--sl-primary)!important}
#app .n-menu-item-group-title{font-size:12px;padding-top:14px!important;height:auto!important;line-height:20px!important}

/* 顶栏 */
#app article>header{height:56px;background:var(--sl-surface)!important;border-bottom:1px solid var(--sl-line)}
#app article>header .n-breadcrumb{font-size:15px;font-weight:500}

/* 内容区 */
#app article>section,#app .cus-scroll-y{background:var(--sl-bg)!important}
@media (min-width:768px){#app .cus-scroll-y{padding:20px!important}}

/* 卡片：细边框、不加阴影 */
#app .n-card{--n-border-radius:var(--sl-radius)!important;--n-border-color:var(--sl-line)!important;--n-color:var(--sl-surface)!important;--n-title-font-size:16px!important;--n-title-font-weight:500!important;box-shadow:none}
#app .n-card.n-card--bordered{border:1px solid var(--sl-line)}
#app .n-card>.n-card-header{padding:16px 20px!important;border-bottom:1px solid var(--sl-line)}
#app .n-card>.n-card-header+.n-card__content{padding:16px 20px 20px!important}
#app .rounded-md{border-radius:var(--sl-radius)!important}
#app .n-list{--n-color-hover:var(--sl-bg)!important;--n-border-color:var(--sl-line)!important;background:transparent}
#app .n-list-item.hover\:bg-gray-100:hover{background:var(--sl-bg)!important}
#app .n-data-table{--n-th-color:var(--sl-bg)!important;--n-border-color:var(--sl-line)!important;--n-border-radius:var(--sl-radius)!important;--n-th-font-weight:500!important;--n-th-text-color:var(--sl-muted)!important}
#app .n-alert{--n-border-radius:6px!important}

/* 公告轮播：没有背景图时给一张深色星空底，不再是灰块 */
#app .n-carousel{background:radial-gradient(60% 90% at 20% 30%,rgba(22,93,255,.45),transparent 70%),radial-gradient(50% 80% at 85% 70%,rgba(168,72,255,.35),transparent 70%),#141826}
#app .carousel-img{background:rgba(0,0,0,.28)!important}

/* 登录 / 注册 / 找回密码 */
#app .wh-full.flex.items-center.justify-center{background-color:var(--sl-bg)}
#app .wh-full.flex.items-center.justify-center>.n-card{border:1px solid var(--sl-line);box-shadow:0 8px 32px rgba(29,33,41,.06)!important}

@media (max-width:767px){
  #app .n-card>.n-card-header{padding:14px 16px!important}
  #app .n-card>.n-card-header+.n-card__content{padding:14px 16px 16px!important}
}
</style>
@include('theme::Xboard.console-dashboard')
