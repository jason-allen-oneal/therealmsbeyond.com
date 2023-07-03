import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";
import * as dotenv from "dotenv";
dotenv.config({ path: "/var/www/trb/.env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("Inserting basic database data");

  const blogCats = await prisma.blogCategory.create({
    data: {
      name: "Test",
      slug: "test",
      parent: 0,
      count: 1,
      hidden: false,
    },
  });

  const galleryCats = await prisma.galleryCategory.create({
    data: {
      name: "Test",
      slug: "test",
      parent: 0,
      count: 1,
      hidden: false,
    },
  });

  const hashedPassword = await hash(process.env.PASS as string);
  const admin = await prisma.user.create({
    data: {
      email: "jason.allen.oneal@gmail.com",
      name: "Chaos Creator",
      password: hashedPassword,
      avatar: "c6b7c9cff765313f.jpg",
      verified: true,
      admin: true,
      slug: "chaos-creator",
      chat: 1,
    },
  });

  const article = await prisma.article.create({
    data: {
      title: "Test",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel ullamcorper lacus. In ut laoreet mi. Phasellus id mattis nisl. Nam ornare elit tellus. Duis a vehicula magna. Nullam tincidunt ex in est gravida, a rhoncus ipsum dictum. Morbi pharetra magna nec diam posuere, in vestibulum purus ultrices.</p><p>Nulla vitae faucibus nisl. Cras nec ornare metus, interdum maximus velit. Sed dapibus arcu eu facilisis vehicula. Cras faucibus, sem et rhoncus iaculis, ligula mauris euismod ex, eget semper nibh dui et sapien. Integer dapibus viverra nisi, ut bibendum massa tincidunt a. In eu lectus quam. Suspendisse potenti. Proin facilisis purus vitae diam vehicula, id consectetur tortor porta. Sed dictum finibus eleifend. Mauris ac nunc interdum nulla iaculis molestie. Aenean iaculis quam sem, non pellentesque odio bibendum quis. Nulla fermentum iaculis arcu, non dictum ante pulvinar eget.</p>",
      slug: "test",
      categoryId: 1,
      featured: false,
      authorId: 1,
    },
  });

  const gallery = await prisma.gallery.create({
    data: {
      title: "Lorem ipsum",
      slug: "lorem-ipsum",
      categoryId: 1,
      featured: false,
      authorId: 1,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel ullamcorper lacus. In ut laoreet mi. Phasellus id mattis nisl.",
      Entry: {
        create: [
          {
            thumb: "",
            path: "KfuxH7iN7F13DHzm.jpg",
            height: 2688,
            width: 4032,
          },
          {
            thumb: "NuLfvIYsktSFx58x.png",
            path: "NuLfvIYsktSFx58x.mp4",
            height: 1440,
            width: 2560,
          },
        ],
      },
    },
  });

  console.log("Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
