const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = dayjs().format('YYYY-MM-DD');
    const startOfDay = dayjs().startOf('day').toDate();
    const endOfDay = dayjs().endOf('day').toDate();

    // 1. EVALUATE TARGETS ON-THE-FLY
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyStepsTarget: true, dailyCalorieTarget: true, weight: true, height: true }
    });

    if (user) {
      // Steps Logic
      const todaySteps = await prisma.activityLog.aggregate({
        where: {
          userId,
          date: new Date(todayStr)
        },
        _sum: { steps: true }
      });
      const totalSteps = todaySteps._sum.steps || 0;
      if (totalSteps >= user.dailyStepsTarget) {
        // Check if we already have a notification for today
        const existingNotif = await prisma.notification.findFirst({
          where: {
            userId,
            title: 'Target langkah harian tercapai!',
            createdAt: { gte: startOfDay, lte: endOfDay }
          }
        });
        if (!existingNotif) {
          await prisma.notification.create({
            data: {
              userId,
              title: 'Target langkah harian tercapai!',
              message: `Luar biasa! Anda telah mencapai ${totalSteps} langkah hari ini.`,
              type: 'SUCCESS'
            }
          });
        }
      }

      // Calories Logic
      let calTarget = user.dailyCalorieTarget;
      if (!calTarget) {
        // fallback calculate based on BMI if not custom
        // simple fallback 2500 if height/weight not full
        if (user.height && user.weight) {
          const heightM = user.height / 100;
          const bmi = user.weight / (heightM * heightM);
          if (bmi < 18.5) calTarget = 2500;
          else if (bmi < 24.9) calTarget = 2000;
          else calTarget = 1500;
        } else {
          calTarget = 2000;
        }
      }

      const todayCalories = await prisma.calorieLog.aggregate({
        where: {
          userId,
          date: new Date(todayStr)
        },
        _sum: { calories: true }
      });
      const totalCal = todayCalories._sum.calories || 0;
      
      if (totalCal >= calTarget) {
        const existingNotif = await prisma.notification.findFirst({
          where: {
            userId,
            title: 'Target kalori harian tercapai!',
            createdAt: { gte: startOfDay, lte: endOfDay }
          }
        });
        if (!existingNotif) {
          await prisma.notification.create({
            data: {
              userId,
              title: 'Target kalori harian tercapai!',
              message: `Bagus! Anda telah mengonsumsi ${totalCal} kcal hari ini, mencapai target Anda.`,
              type: 'SUCCESS'
            }
          });
        }
      }
    }

    // 2. FETCH ALL NOTIFICATIONS
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({
      status: 'success',
      data: notifications
    });
  } catch (error) {
    console.error('getNotifications Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    // Mark all unread as read
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    res.json({ status: 'success', message: 'All notifications marked as read' });
  } catch (error) {
    console.error('markAsRead Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update notifications' });
  }
};
