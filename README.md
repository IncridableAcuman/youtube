# 🎥 YouTube Clone — Full-Stack Video Platform

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

Videolarni ulashish, izlash, yoqtirish (like/dislike) va kanallarni boshqarish imkoniyatini beruvchi zamonaviy Full-Stack web ilova.

---

## 🚀 Texnologiyalar Steki

### **Backend**
* **Framework:** Java 17+, Spring Boot 3.x
* **Security:** Spring Security + JWT Authentication (Access & Refresh Token)
* **Database:** MongoDB (Spring Data MongoDB)
* **Text Search:** MongoDB `$text` Indexing
* **Build Tool:** Gradle / Maven

### **Frontend**
* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **State Management:** Zustand
* **Styling:** Tailwind CSS + Framer Motion
* **HTTP Client:** Axios (Interceptors & Auto-refresh queue)

---

## ✨ Asosiy Imkoniyatlar

* 🔐 **Xavfsiz Authentifikatsiya:** JWT Token va HttpOnly Cookie orqali Refresh Token mexanizmi.
* 📹 **Video Boshqaruvi:** YouTube URL orqali video qo'shish, tahrirlash va o'chirish.
* 🔍 **Smart Qidiruv (Full-Text Search):** Sarlavha, tavsif va teglar bo'yicha tezkor matnli qidiruv.
* 👍 **Reaksiyalar Tizimi:** Videolarga Like va Dislike bosish funksionali.
* 📺 **Kanallar:** Foydalanuvchi profiliga bog'langan avtomatik kanal nomi generatsiyasi.
* 📄 **Paginatsiya:** Videolar ro'yxati va qidiruv natijalari uchun sahifalash.

---

## 🛠 Translyatsiya va O'rnatish

### **Oldindan talab qilinadigan vositalar:**
* Java Development Kit (JDK) 21
* Node.js 22 va npm
* MongoDB Server (localhost:27017)

---

### 1. Backend Sozlamalari

**Kanalni klonlang:**
```bash
git clone [https://github.com/username/youtube-clone.git](https://github.com/username/youtube-clone.git)
cd youtube-clone/backend