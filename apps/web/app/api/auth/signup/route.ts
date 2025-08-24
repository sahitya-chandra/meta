import prisma from '@meta/db';
import { SignUpInput, SignUpSchema } from '@meta/types';
import { genSaltSync, hashSync } from 'bcrypt-ts';

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = SignUpSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const data: SignUpInput = parsed.data;
    const salt = genSaltSync(10);
    const hashedPassword = await hashSync(data.password, salt);

    const userExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExist) return Response.json({ msg: 'user exits' });

    await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return Response.json({ msg: 'User created' }, { status: 201 });
  } catch (error) {
    console.log('error:', error);
    return Response.json({ error }, { status: 500 });
  }
}
