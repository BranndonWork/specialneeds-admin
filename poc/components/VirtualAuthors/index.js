import Utils from "@utils";
import { serveAsset } from "@utils/assetHelpers";
import Link from "next/link";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
const VirtualAuthors = ({ toggleShowMore, authors }) => {
  const renderAvatar = (author) => {
    const { name, avatar } = author;
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    if (!avatar) {
      return `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }
    return serveAsset(avatar, 500);
  };

  const renderBio = (author) => {
    const MAX_LENGTH = 150;
    const { bio, showMore } = author;
    if (showMore || bio.length <= MAX_LENGTH) {
      return bio;
    }
    return `${bio.substring(0, MAX_LENGTH)}...`;
  };

  const getProfileLink = (name) => {
    if (!name) {
      return;
    }
    let kebabCaseName = name
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    return `/virtual-authors/${kebabCaseName}`;
  };

  const displayInterest = (interests) => {
    let formattedInterests = interests;
    if (typeof interests === "string" && interests.startsWith("[")) {
      formattedInterests = JSON.parse(formattedInterests.replace(/'/g, '"'));
    }
    if (typeof formattedInterests === "object") {
      formattedInterests = formattedInterests.join(", ");
    }
    return formattedInterests;
  };

  console.debug("authors", authors);

  return (
    <Container>
      <Row>
        {authors.map((author) => (
          <Col key={author.id} sm={12} md={4} lg={3} className="mb-4">
            <Card>
              <Link href={getProfileLink(author.name)} className="myLinkClass">
                <Card.Img variant="top" src={renderAvatar(author)} />
              </Link>
              <Card.Body>
                <Card.Title>
                  <Link href={getProfileLink(author.name)} className="myLinkClass">
                    {author.name}
                  </Link>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {author.age} years old, {author.gender}
                </Card.Subtitle>
                <Card.Text>{renderBio(author)}</Card.Text>
                {author.bio.length > 150 && (
                  <Button
                    variant="link"
                    onClick={() => toggleShowMore(author.id)}
                    className="p-0 mb-2"
                  >
                    {author.showMore ? "Show less" : "Show more"}
                  </Button>
                )}
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Interests: {displayInterest(author.interests)}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      <style jsx>{`
        .myLinkClass {
          cursor: pointer;
          text-decoration: underline;
          color: blue;
        }

        .myLinkClass:hover {
          text-decoration: none;
        }
      `}</style>
    </Container>
  );
};


export default VirtualAuthors;
