# 项目名称：亮车惠 · 自助洗车系统

## 核心技术栈
- **前端**: Vue 3 (使用 Vant 和 Element Plus 组件库)
- **后端**: Node.js + NestJS 框架 (使用 TypeScript)
- **数据库**: MySQL (主数据库) + Redis (缓存)
- **部署**: Docker + Docker Compose

## 核心业务模块
我们的系统分为三个主要部分：用户端、商户端、平台管理端。因此，后端需要设计对应的模块来支撑业务。

1.  **用户模块 (User Module)**
    - 核心功能：手机号验证码登录/注册、订单管理、微信支付、账户充值、优惠券。
    - 核心数据表：`users`, `orders`, `transactions`, `coupons`。

2.  **商户模块 (Merchant Module)**
    - 核心功能：门店管理、设备管理、查看营收流水、发起提现。
    - 核心数据表：`merchants`, `stores`, `devices`, `withdrawals`。

3.  **平台模块 (Platform Module)**
    - 核心功能：商户入驻审核、全局设备监控、财务结算、优惠活动配置。

4.  **认证与授权模块 (Auth Module)**
    - 使用 JWT (JSON Web Tokens) 进行用户和商户的身份认证。
    - 实现基于角色的访问控制 (RBAC)。

## 开发规范
- 所有API接口都应遵循 RESTful 风格。
- 代码风格遵循 Prettier 的默认规范。
