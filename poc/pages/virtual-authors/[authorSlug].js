import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import Navbar from "@components/_App/Navbar";
import EditButton from "@components/Shared/EditButton";
import { getArticleImage } from "@utils/articles/getArticleImage";
import buildEndpoint from "@utils/server/api/buildEndpoint";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const PAGE_SIZE = 12;

const AuthorSlugPage = ({ author, articles: initialArticles, totalArticles }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const hasMore = articles.length < totalArticles;

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const res = await fetch(
        `/api/v1/author-articles?author_slug=${encodeURIComponent(author.slug)}&page=${nextPage}&page_size=${PAGE_SIZE}`
      );
      const data = await res.json();
      setArticles((prev) => [...prev, ...(data.articles || [])]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageBanner
        bannerFilename="virtual authors"
        pageTitle={author.displayname}
      />
      <EditButton content={author} />

      <Container className="my-5">
        <Row>
          {author.avatar && (
            <Col xs={12} sm={2} className="mb-4">
              <Image
                src={author.avatar}
                alt={author.displayname}
                width={150}
                height={150}
                style={{ borderRadius: "50%", width: "100%", height: "auto" }}
              />
            </Col>
          )}
          <Col xs={12} sm={author.avatar ? 10 : 12} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{author.displayname}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <small>Virtual Author</small>
                </Card.Subtitle>
                {author.bio && <Card.Text>{author.bio}</Card.Text>}
              </Card.Body>
              {author.interests && (
                <Card.Footer>
                  <small className="text-muted">Interests: {author.interests}</small>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>

        <div className="virtual-author-info my-4">
          <p>
            Virtual Authors are a fantastic team of imaginary writers, created by some really smart
            computers. These authors have unique names, fancy vector art avatars, and interesting
            bios. But remember, they&apos;re not real people! They&apos;re here to help us write fun and
            helpful content on SpecialNeeds.com.
          </p>
          <p>
            Why do we use Virtual Authors?{" "}
            <Link href="/virtual-authors/" className="link">
              Click here to find out!
            </Link>
          </p>
        </div>

        <Row className="author-page-articles">
          {articles.map((article) => (
            <Col key={article.article_data.id} sm={12} md={4} lg={3} className="mb-4">
              <Card>
                <Link href={`/${article.article_data.slug}/`} className="link" target="_blank">
                  <div
                    className="image-wrapper"
                    style={{ backgroundImage: `url(${getArticleImage(article.article_data, 500)})` }}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>
                    <Link href={`/${article.article_data.slug}/`} className="link" target="_blank">
                      {article.article_data.title}
                    </Link>
                  </Card.Title>
                  <Card.Text>{article.article_data?.summary}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Published{" "}
                    {new Date(article.article_data.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {hasMore && (
          <Row>
            <Col className="text-center" xs={12}>
              <Button
                variant="primary"
                onClick={loadMore}
                disabled={loading}
                style={{ margin: "0 auto" }}
              >
                {loading ? "Loading..." : "Load more articles"}
              </Button>
            </Col>
          </Row>
        )}
      </Container>

      <Footer />
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { authorSlug } = params;
  const storedSlug = `/users/${authorSlug}/`;

  const [authorRes, articlesRes] = await Promise.allSettled([
    fetch(buildEndpoint(`/user/authors/${authorSlug}/`)).then((r) => (r.ok ? r.json() : null)),
    fetch(
      buildEndpoint(`/articles/?author_slug=${encodeURIComponent(storedSlug)}&page_size=${PAGE_SIZE}`)
    ).then((r) => (r.ok ? r.json() : null)),
  ]);

  const author =
    authorRes.status === "fulfilled" && authorRes.value?.response
      ? authorRes.value.response
      : null;

  if (!author) {
    return { notFound: true };
  }

  const articlesData =
    articlesRes.status === "fulfilled" ? articlesRes.value : null;

  return {
    props: {
      author,
      articles: articlesData?.articles || [],
      totalArticles: articlesData?.total || 0,
    },
  };
}

export default AuthorSlugPage;
