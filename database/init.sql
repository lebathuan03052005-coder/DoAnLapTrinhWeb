USE [master]
GO
CREATE DATABASE [Booking_Web];
GO
ALTER DATABASE [Booking_Web] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Booking_Web].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Booking_Web] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Booking_Web] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Booking_Web] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Booking_Web] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Booking_Web] SET ARITHABORT OFF 
GO
ALTER DATABASE [Booking_Web] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [Booking_Web] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Booking_Web] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Booking_Web] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Booking_Web] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Booking_Web] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Booking_Web] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Booking_Web] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Booking_Web] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Booking_Web] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Booking_Web] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Booking_Web] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Booking_Web] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Booking_Web] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Booking_Web] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Booking_Web] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Booking_Web] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Booking_Web] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Booking_Web] SET  MULTI_USER 
GO
ALTER DATABASE [Booking_Web] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Booking_Web] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Booking_Web] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Booking_Web] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Booking_Web] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Booking_Web] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Booking_Web] SET QUERY_STORE = OFF
GO
USE [Booking_Web]
GO
/****** Object:  Table [dbo].[Admin_Logs]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admin_Logs](
	[id] [int] NOT NULL,
	[admin_id] [int] NULL,
	[action] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Booking_Details]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Booking_Details](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[booking_id] [int] NULL,
	[room_type_id] [int] NULL,
	[room_id] [int] NULL,
	[quantity] [int] NULL,
	[check_in_date] [date] NULL,
	[check_out_date] [date] NULL,
	[price_at_booking] [decimal](10, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bookings]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bookings](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hotel_id] [int] NULL,
	[user_id] [int] NULL,
	[guest_name] [nvarchar](255) NULL,
	[guest_phone] [nvarchar](255) NULL,
	[guest_email] [nvarchar](255) NULL,
	[total_amount] [decimal](10, 2) NULL,
	[status] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Hotel_Images]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hotel_Images](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hotel_id] [int] NULL,
	[image_url] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Hotels]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hotels](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[partner_id] [int] NULL,
	[name] [nvarchar](255) NOT NULL,
	[city] [nvarchar](255) NULL,
	[address] [nvarchar](max) NULL,
	[description] [nvarchar](max) NULL,
	[status] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Room_Closures]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Room_Closures](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[room_id] [int] NULL,
	[start_date] [date] NULL,
	[end_date] [date] NULL,
	[reason] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Room_Images]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Room_Images](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[room_type_id] [int] NULL,
	[image_url] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Room_Types]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Room_Types](
	[id] [int] NOT NULL,
	[hotel_id] [int] NULL,
	[name] [nvarchar](255) NULL,
	[base_price] [decimal](10, 2) NULL,
	[capacity] [int] NULL,
	[bed_type] [nvarchar](255) NULL,
	[view_type] [nvarchar](255) NULL,
	[has_bathtub] [bit] NULL,
	[amenities] [nvarchar](max) NULL,
	[description] [nvarchar](max) NULL,
	[is_deleted] [bit] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rooms]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rooms](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[room_type_id] [int] NULL,
	[room_number] [nvarchar](255) NULL,
	[status] [nvarchar](255) NULL,
	[is_deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/19/2026 3:30:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[password_hash] [nvarchar](255) NOT NULL,
	[full_name] [nvarchar](255) NULL,
	[phone] [nvarchar](255) NULL,
	[role] [nvarchar](255) NULL,
	[status] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Admin_Logs] ([id], [admin_id], [action], [created_at]) VALUES (1, 1, N'ACTIVE', NULL)
GO
SET IDENTITY_INSERT [dbo].[Hotel_Images] ON 

INSERT [dbo].[Hotel_Images] ([id], [hotel_id], [image_url]) VALUES (1, 1, N'https://link-anh.jpg')
SET IDENTITY_INSERT [dbo].[Hotel_Images] OFF
GO
SET IDENTITY_INSERT [dbo].[Hotels] ON 

INSERT [dbo].[Hotels] ([id], [partner_id], [name], [city], [address], [description], [status], [created_at], [updated_at]) VALUES (1, 1, N'Sea View Hotel Đà Nẵng', N'Đà Nẵng', N'120 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng', N'Khách sạn 4 sao gần biển Mỹ Khê, có hồ bơi, nhà hàng và dịch vụ đưa đón sân bay.', N'ACTIVE', CAST(N'2026-06-15T17:06:17.433' AS DateTime), CAST(N'2026-06-15T17:06:17.433' AS DateTime))
SET IDENTITY_INSERT [dbo].[Hotels] OFF
GO
INSERT [dbo].[Room_Types] ([id], [hotel_id], [name], [base_price], [capacity], [bed_type], [view_type], [has_bathtub], [amenities], [description], [is_deleted], [created_at], [updated_at]) VALUES (1, 1, N'12', CAST(155000.00 AS Decimal(10, 2)), 2, N'Double', NULL, 0, N'Bồn tắm,Wifi,View biển', NULL, 1, CAST(N'2026-06-19T12:50:42.540' AS DateTime), CAST(N'2026-06-19T12:51:01.447' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([id], [email], [password_hash], [full_name], [phone], [role], [status], [created_at], [updated_at]) VALUES (1, N'lebathuan03052005@gmail.com', N'$2a$10$v/rXXukWlJXZZBwxkIdJFuMfXKPoQG5Wznd97YWrsjRNQGuckhwle', N'Lê Bá Thuần', N'0862680850', N'ADMIN', N'ACTIVE', NULL, NULL)
INSERT [dbo].[Users] ([id], [email], [password_hash], [full_name], [phone], [role], [status], [created_at], [updated_at]) VALUES (2, N'123@gmail.com', N'$2a$10$o975r1uuFw8Yg/QBaqOetuPw2h/f5KLR20v9t12GRnvitbH7iC.hG', N'Trần Cao Nguyên', N'0862680850', N'customer', N'ACTIVE', CAST(N'2026-06-15T18:26:52.860' AS DateTime), NULL)
INSERT [dbo].[Users] ([id], [email], [password_hash], [full_name], [phone], [role], [status], [created_at], [updated_at]) VALUES (3, N'customer@test.com', N'$2a$10$v/rXXukWlJXZZBwxkIdJFuMfXKPoQG5Wznd97YWrsjRNQGuckhwle', N'nguyen', N'0901234567', N'customer', N'ACTIVE', CAST(N'2026-06-19T10:48:55.533' AS DateTime), NULL)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__AB6E61640ABDC605]    Script Date: 6/19/2026 3:30:55 PM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Booking_Details] ADD  DEFAULT ((1)) FOR [quantity]
GO
ALTER TABLE [dbo].[Bookings] ADD  DEFAULT ('PENDING') FOR [status]
GO
ALTER TABLE [dbo].[Hotels] ADD  DEFAULT ('PENDING') FOR [status]
GO
ALTER TABLE [dbo].[Room_Types] ADD  DEFAULT ((0)) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Rooms] ADD  DEFAULT ('AVAILABLE') FOR [status]
GO
ALTER TABLE [dbo].[Rooms] ADD  DEFAULT ((0)) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('CUSTOMER') FOR [role]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('ACTIVE') FOR [status]
GO
ALTER TABLE [dbo].[Admin_Logs]  WITH CHECK ADD FOREIGN KEY([admin_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Booking_Details]  WITH CHECK ADD FOREIGN KEY([booking_id])
REFERENCES [dbo].[Bookings] ([id])
GO
ALTER TABLE [dbo].[Booking_Details]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
ALTER TABLE [dbo].[Booking_Details]  WITH CHECK ADD FOREIGN KEY([room_id])
REFERENCES [dbo].[Rooms] ([id])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([hotel_id])
REFERENCES [dbo].[Hotels] ([id])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Hotel_Images]  WITH CHECK ADD FOREIGN KEY([hotel_id])
REFERENCES [dbo].[Hotels] ([id])
GO
ALTER TABLE [dbo].[Hotels]  WITH CHECK ADD FOREIGN KEY([partner_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Room_Closures]  WITH CHECK ADD FOREIGN KEY([room_id])
REFERENCES [dbo].[Rooms] ([id])
GO
ALTER TABLE [dbo].[Room_Images]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
ALTER TABLE [dbo].[Room_Types]  WITH CHECK ADD FOREIGN KEY([hotel_id])
REFERENCES [dbo].[Hotels] ([id])
GO
ALTER TABLE [dbo].[Rooms]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
USE [master]
GO
ALTER DATABASE [Booking_Web] SET  READ_WRITE 
GO
