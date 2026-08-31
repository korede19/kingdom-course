import "server-only";
import { prisma } from "@/lib/db";
import { LESSON_COUNT } from "@/lib/constants";

export type OverviewStats = {
  totalUsers: number;
  certificatesEarned: number;
  avgCompletionPercent: number;
  orderCount: number;
  orderRevenueCents: number;
  donationCount: number;
  donationTotalCents: number;
};

export async function getOverviewStats(): Promise<OverviewStats> {
  const [totalUsers, certificatesEarned, passedLessonCount, orderAgg, donationAgg] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { completionDate: { not: null } } }),
    prisma.lessonProgress.count({ where: { quizPassed: true } }),
    prisma.order.aggregate({ _count: true, _sum: { totalCents: true }, where: { paymentStatus: "paid" } }),
    prisma.donation.aggregate({ _count: true, _sum: { amountCents: true }, where: { paymentStatus: "paid" } }),
  ]);

  const avgCompletionPercent =
    totalUsers === 0 ? 0 : Math.round((passedLessonCount / (totalUsers * LESSON_COUNT)) * 100);

  return {
    totalUsers,
    certificatesEarned,
    avgCompletionPercent,
    orderCount: orderAgg._count,
    orderRevenueCents: orderAgg._sum.totalCents ?? 0,
    donationCount: donationAgg._count,
    donationTotalCents: donationAgg._sum.amountCents ?? 0,
  };
}

export type UserSort = "recent" | "name" | "email";

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  lessonsCompleted: number;
  badges: number;
  completionPercent: number;
  certificateDate: Date | null;
  lastActivity: Date;
};

export async function getUsersPage({
  search,
  page,
  pageSize,
  sort,
}: {
  search: string;
  page: number;
  pageSize: number;
  sort: UserSort;
}): Promise<{ users: UserSummary[]; total: number }> {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const orderBy = sort === "name" ? { name: "asc" as const } : sort === "email" ? { email: "asc" as const } : { createdAt: "desc" as const };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { progress: true },
    }),
    prisma.user.count({ where }),
  ]);

  const summaries: UserSummary[] = users.map((user) => {
    const lessonsCompleted = user.progress.filter((p) => p.quizPassed).length;
    const badges = user.progress.filter((p) => p.badgeEarned).length;
    const lastActivity = user.progress.reduce(
      (latest, p) => (p.updatedAt > latest ? p.updatedAt : latest),
      user.createdAt,
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      lessonsCompleted,
      badges,
      completionPercent: Math.round((lessonsCompleted / LESSON_COUNT) * 100),
      certificateDate: user.completionDate,
      lastActivity,
    };
  });

  return { users: summaries, total };
}

export async function getUserDetail(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      progress: { orderBy: { lessonNum: "asc" } },
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      donations: { orderBy: { createdAt: "desc" } },
    },
  });
}

export type OrderStatusFilter = "all" | "pending" | "paid";

export async function getOrdersPage({
  status,
  page,
  pageSize,
}: {
  status: OrderStatusFilter;
  page: number;
  pageSize: number;
}) {
  const where = status === "all" ? {} : { paymentStatus: status };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
}

export async function getPassportApplicationsPage({
  status,
  page,
  pageSize,
}: {
  status: OrderStatusFilter;
  page: number;
  pageSize: number;
}) {
  const where = status === "all" ? {} : { paymentStatus: status };

  const [applications, total] = await Promise.all([
    prisma.passportApplication.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.passportApplication.count({ where }),
  ]);

  return { applications, total };
}
