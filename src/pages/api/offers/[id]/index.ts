import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { offerValidationSchema } from 'validationSchema/offers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.offer
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getOfferById();
    case 'PUT':
      return updateOfferById();
    case 'DELETE':
      return deleteOfferById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOfferById() {
    const data = await prisma.offer.findFirst(convertQueryToPrismaUtil(req.query, 'offer'));
    return res.status(200).json(data);
  }

  async function updateOfferById() {
    await offerValidationSchema.validate(req.body);
    const data = await prisma.offer.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteOfferById() {
    const data = await prisma.offer.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
