import Link from "next/link";

type Props = {
  base: string;
  parent: Category;
  item: string;
};

const Breadcrumbs = ({ base, parent, item }: Props) => {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href={`/${base}/`}>
            <a>{base.charAt(0).toUpperCase() + base.slice(1).toLowerCase()}</a>
          </Link>
        </li>
        <li>
          <Link href={`/${base}/category/${parent.id}/${parent.slug}/`}>
            <a>{parent.name}</a>
          </Link>
        </li>
        <li>{item}</li>
      </ul>
    </div>
  );
};

export default Breadcrumbs;
