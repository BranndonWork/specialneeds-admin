import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import Navbar from "@components/_App/Navbar";
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import { getArticleImage } from "@utils/articles/getArticleImage";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import EditButton from "../../components/Shared/EditButton";

const ARTICLE_LIMIT = 12;

const AuthorSlugPage = ({ author, articles: initialArticles, authorSlug }) => {
  const [articles, setArticles] = useState(initialArticles || []);
  const [loadMorePage, setLoadMorePage] = useState(2);
  const [loadMoreEnabled, setLoadMoreEnabled] = useState(true);

  const loadMoreArticles = async () => {
    if (!loadMoreEnabled) return;
    setLoadMoreEnabled(false);

    try {
      const res = await fetch(
        `/api/v1/author-articles?author_slug=${encodeURIComponent(authorSlug)}&page=${loadMorePage}&page_size=${ARTICLE_LIMIT}`
      );
      const data = await res.json();
      const moreArticles = data?.results || data?.articles || [];
      setArticles(prev => [...prev, ...moreArticles]);
      setLoadMorePage(prev => prev + 1);
    } finally {
      setLoadMoreEnabled(true);
    }
  };

  const renderAvatar = (user) => {
    const { displayname, avatar } = user;
    const initials = displayname
      .split(" ")
      .map((n) => n[0])
      .join("");
    return avatar || `https://ui-avatars.com/api/?name=${initials}&background=random`;
  };

  const getArticleData = (article) => article.article_data || article;

  if (!author) return null;

  return (
    <>
      <Navbar user={author} />

      <PageBanner bannerFilename="default" pageTitle="<a href='/authors/'>Authors</a>" />
      <EditButton user={author} content={author} />

      <Container className="my-5">
        <h5>Author Profile</h5>
        <div className="user-info">
          <p>
            Authors are our fantastic community members. They help us create an inclusive environment
            with diverse interests and insights. 📝
          </p>
          <p>
            What do we offer to our Authors? 🤔{" "}
            <Link href="/authors/" className="link">
              Click here to find out!
            </Link>
          </p>
        </div>
      </Container>

      <Container className="my-5">
        <Row>
          <Col className="mb-4" xs={12} sm={2}>
            <Link href={author.slug} className="link" target="_blank">
              <Card.Img variant="top" src={renderAvatar(author)} />
            </Link>
          </Col>
          <Col className="mb-4" xs={12} sm={10}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <Link href={author.slug} className="link">
                    {author.displayname}
                  </Link>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <small className="text-muted">Author</small>
                </Card.Subtitle>
                <Card.Text>{author.bio}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Interests: {author.interests || "???"}</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row className="author-page-articles">
          {articles.map((article) => {
            const a = getArticleData(article);
            return (
              <Col key={a.id} sm={12} md={4} lg={3} className="mb-4">
                <Card>
                  <Link href={`/${a.slug}/`} className="link" target="_blank">
                    <div
                      className="image-wrapper"
                      style={{ backgroundImage: `url(${getArticleImage(a, 500)})` }}
                    />
                  </Link>
                  <Card.Body>
                    <Card.Title>
                      <Link href={`/${a.slug}/`} className="link" target="_blank">
                        {a.title}
                      </Link>
                    </Card.Title>
                    <Card.Text>{a.summary}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Published {new Date(a.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </small>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
        {articles.length > 0 && (
          <Row>
            <Col className="text-center" xs={12}>
              <Button variant="primary" onClick={loadMoreArticles} style={{ margin: "0 auto" }}>
                Load more articles
              </Button>
            </Col>
          </Row>
        )}
      </Container>

      <Footer />
    </>
  );
};

export async function getStaticProps(context) {
  const { authorSlug } = context.params;
  const api = new SpecialNeedsAPI(context);

  try {
    const [authorData, articlesData] = await Promise.all([
      api.get(`/user/authors/${authorSlug}/`),
      api.get(`/articles/?author_slug=${encodeURIComponent(authorSlug)}&page_size=${ARTICLE_LIMIT}`),
    ]);

    const author = authorData?.user || authorData;
    const articles = articlesData?.results || articlesData?.articles || [];

    if (!author?.displayname) {
      return { notFound: true };
    }

    return {
      props: { author, articles, authorSlug },
      revalidate: 3600,
    };
  } catch (error) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export default AuthorSlugPage;
