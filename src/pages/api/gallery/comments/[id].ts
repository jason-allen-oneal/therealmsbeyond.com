import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const id = parseInt(req.query.id as string);
	
	const comments = await prisma?.galleryComment.findMany({
		where: {
			galleryId: id
		},
	});
	
	const data = {
		status: 200,
		message: "Retrieved",
		result: comments,
	};
	
	res.json(data);
}

export default handler;