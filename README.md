# PwT Next

Website chính thức của PwT Tech, xây dựng bằng Next.js 16, React 19, Tailwind CSS 4 và SQLite.

## Tính năng

- Trang landing page giới thiệu dịch vụ
- Live chat tích hợp AI (DeepSeek) với fallback chuyển tiếp Telegram
- Bảng điều khiển admin quản lý hội thoại (Basic Auth)
- Các trang pháp lý: Chính sách bảo mật, Điều khoản dịch vụ, Chính sách hoàn tiền, v.v.

## Yêu cầu

- Node.js >= 20
- npm >= 10

## Cài đặt

```bash
npm install
cp .env.example .env
# Điền các giá trị vào .env
```

## Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Build & Production

```bash
npm run build
npm start
```

## Biến môi trường

Xem file `.env.example` để biết các biến cần thiết.

## Admin

Truy cập `/admin/chat` với Basic Auth (cấu hình trong `middleware.ts`).
