
# Event Management Platform

A robust and scalable web application designed to simplify event organization and participation. The Event Management Platform offers seamless event creation, booking, and payment processing for both organizers and attendees.

---

##  Project Overview

The Event Management Platform enables:

- Event creation, editing, and deletion.
- User registration and authentication.
- Role-based access for **Organizers** and **Attendees**.
- Real-time seat management and booking.
- Secure payment processing via **Razorpay**.
- Smooth user experience with secure JWT-based session handling.

---

## 👥 User Roles

### 🔹 Organizer
- Create, update, and delete events.
- Manage organizational metadata.
- View attendees for each event.

### 🔹 Attendee
- Explore upcoming events.
- Book event seats with integrated payment.
- Cancel bookings to release seats.
- View personal booking history.

---

## 🗂️ System Architecture

### 💡 Entity Overview
- `User`: Holds user credentials and role information.
- `OrganizerDetails`: Stores organization metadata.
- `Event`: Describes the event details including category, schedule, and seat management.
- `Booking`: Records event bookings and references to payment.
- `MyOrder`: Stores payment transaction details.

### 🗺️ Key Diagrams
- **Entity-Relationship Diagram (ERD)** — Defines relationships between core entities.
- **Sequence Diagram** — Flow of event creation, booking, payment, and confirmation.
- **Data Flow Diagram** — Outlines the data journey across modules.

---

## 🗃️ Database Schema

| Table Name         | Description                                  |
|---------------------|----------------------------------------------|
| `users`             | User credentials and roles                  |
| `events`            | Event metadata and seat information         |
| `bookings`          | Event booking records                       |
| `my_order`          | Payment transaction tracking                |
| `organizer_details` | Organizer's organization data               |

---

## 🔗 API Endpoints

| Method | Endpoint                                      | Description                                     |
|--------|-----------------------------------------------|-------------------------------------------------|
| POST   | `/user/create-user`                           | Register a new user                             |
| POST   | `/events/create-event`                        | Create a new event                              |
| POST   | `/generate-token`                             | User login & JWT token generation               |
| GET    | `/events/organizer/{userId}`                  | Fetch events created by an organizer            |
| PUT    | `/events/update/{id}`                         | Update an existing event                        |
| DELETE | `/events/{id}`                                | Delete an event                                 |
| GET    | `/events/category/{category}`                | Retrieve events by category                     |
| GET    | `/events/getEnrolledPeople/{eventId}`         | Get enrolled users for an event                 |
| GET    | `/events`                                     | View all events                                 |
| GET    | `/bookings/all/{id}`                          | Retrieve all bookings for a user                |
| POST   | `/bookings/create-booking/{refId}`            | Book an event                                   |
| PUT    | `/bookings/cancel/{bookingId}`                | Cancel a booking                                |
| POST   | `/payment/create-order`                       | Initiate payment                                |
| PUT    | `/payment/update-order`                       | Update payment status                           |
| PUT    | `/user/update`                                | Update user profile                             |

---

## 🔒 Authentication & Authorization

- **Spring Security** — Secure endpoints with role-based access.
- **JWT Token System** — Stateless and secure session management.
- **BCrypt Encryption** — Strong password hashing.

---

## 💳 Payment Integration

- Razorpay-based secure payment flow.
- Orders tracked via `MyOrder` entity.
- Real-time payment status updates.

---

## 💡 Features

✅ **User Registration & Login**  
✅ **Role-based Access Control (RBAC)**  
✅ **Event Creation & Management**  
✅ **Secure Booking System**  
✅ **Payment Gateway Integration (Razorpay)**  
✅ **Booking History & Cancellation**  
✅ **Optimistic Seat Management**  

---

## 🧑‍💻 Tech Stack

- **Backend:** Java, Spring Boot  
- **Database:** PostgreSQL  
- **Security:** Spring Security, JWT, BCrypt  
- **Payment Gateway:** Razorpay  

---

## 📌 Conclusion

This Event Management Platform is designed to streamline the event lifecycle — from creation to booking to payment — while ensuring security, performance, and scalability. Whether you're hosting events or booking your next one, this platform offers a smooth and reliable experience.
