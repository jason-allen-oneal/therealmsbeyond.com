import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const id = parseInt(req.query.id as string);
	
	const comments = await prisma?.blogComment.findMany({
		where: {
			articleId: id
		},
		include: {
			User: true,
		}
	});
	
	const data = {
		status: 200,
		message: "Retrieved",
		result: comments,
	};
	
	res.json(data);
}

export default handler;