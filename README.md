# PwT Next

Website chính thức của PwT Tech, xây dựng bằng Next.js 16, React 19, Tailwind CSS 4 và SQLite.

## Tính năng

- Trang landing page giới thiệu dịch vụ
- Form contact/order gửi email xác nhận cho khách và email thông báo cho admin qua Resend
- Live chat tích hợp AI (DeepSeek) với fallback chuyển tiếp Telegram
- Bảng điều khiển admin quản lý hội thoại (Basic Auth)
- Các trang pháp lý: Chính sách bảo mật, Điều khoản dịch vụ, Chính sách hoàn tiền, v.v.

## Yêu cầu

- Node.js >= 20
- pnpm >= 10

## Cài đặt

```bash
pnpm install
cp .env.example .env
# Điền các giá trị vào .env
```

## Chạy development

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Build & Production

```bash
pnpm build
pnpm start
```

## Biến môi trường

Xem file `.env.example` để biết các biến cần thiết.

Biến mới cho email contact form:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_ADMIN_EMAIL`
- `RESEND_REPLY_TO_EMAIL` (tuỳ chọn, khuyến nghị dùng để nhận phản hồi từ email xác nhận)

## Admin

Truy cập `/admin/chat` với Basic Auth (cấu hình trong `middleware.ts`).
