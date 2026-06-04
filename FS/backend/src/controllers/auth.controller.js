/**
 * Auth Controller — Register, Login, Forgot Password, Change Password
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient();

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * POST /api/auth/register
 * Mendaftarkan akun pengguna baru
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.validatedBody;

    // 1. Check apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email sudah terdaftar',
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4. Generate JWT
    const token = generateToken(user);

    // 5. Return response
    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Autentikasi pengguna
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    // 1. Cari user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    // 3. Generate JWT
    const token = generateToken(user);

    // 4. Return response
    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 * Simulasi reset password (tanpa kirim email)
 */
const forgotPassword = async (req, res, next) => {
  try {
    // Simulasi — selalu return success untuk keamanan
    // (tidak memberitahu apakah email terdaftar atau tidak)
    res.json({
      message: 'Link reset telah dikirim ke email kamu',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 * Ganti password (dari Settings page)
 * Auth: Required
 */
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.validatedBody;
    const userId = req.user.id;

    // 1. Ambil user dari database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
      });
    }

    // 2. Compare old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        message: 'Password lama salah',
      });
    }

    // 3. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // 4. Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({
      message: 'Password berhasil diubah',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  changePassword,
};
