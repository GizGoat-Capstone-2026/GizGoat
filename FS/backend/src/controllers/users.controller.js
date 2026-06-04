/**
 * Users Controller — Profile CRUD + Delete Account
 */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { calculateBmi, getBmiDetails } = require('../utils/bmiCalculator');

const prisma = new PrismaClient();

/**
 * GET /api/users/profile
 * Mengambil data profil pengguna lengkap + computed BMI
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        occupation: true,
        dailyStepsTarget: true,
        dailyCalorieTarget: true,
        dailyCarbsTarget: true,
        dailyProteinTarget: true,
        dailyFatTarget: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
      });
    }

    // Compute BMI on-the-fly
    const bmi = calculateBmi(user.height, user.weight);
    const bmiCategory = bmi ? getBmiDetails(bmi).category : null;

    res.json({
      ...user,
      bmi,
      bmiCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Update data profil (hanya field yang dikirim)
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.validatedBody;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    // Recalculate BMI if height or weight changed
    let bmi = null;
    if (data.height !== undefined || data.weight !== undefined) {
      bmi = calculateBmi(updatedUser.height, updatedUser.weight);
    }

    const response = {
      message: 'Profil berhasil diperbarui',
      name: updatedUser.name,
      email: updatedUser.email,
    };

    if (bmi !== null) {
      response.bmi = bmi;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/account
 * Hapus akun + cascade delete semua data terkait
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.validatedBody;

    // 1. Ambil user untuk verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
      });
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Password salah',
      });
    }

    // 3. Delete user (cascade deletes all related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      message: 'Akun berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};
