import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import Navbar from "@components/_App/Navbar";
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import { useState } from "react";
import VirtualAuthors from "../../components/VirtualAuthors";

const DisplayAllVirtualAuthors = ({ authorsRaw }) => {
  const [authors, setAuthors] = useState(
    () => (authorsRaw || []).map((author) => ({ ...author, showMore: false }))
  );

  const toggleShowMore = (authorId) => {
    setAuthors(
      authors.map((author) =>
        author.id === authorId ? { ...author, showMore: !author.showMore } : author
      )
    );
  };

  if (!authors.length) {
    return null;
  }

  return (
    <div className="main-text-content ptb-50" style={{ maxWidth: "767px", margin: "0 auto" }}>
      <h3>Meet our Virtual Authors</h3>
      <VirtualAuthors
        authors={authors}
        toggleShowMore={toggleShowMore}
      />
    </div>
  );
};

const VirtualAuthorsPage = ({ authorsRaw }) => {
  return (
    <>
      <Navbar />

      <PageBanner
        bannerFilename="virtual authors"
        pageTitle="Virtual Authors"
        pageName="Virtual Authors"
      />

      <div className="ptb-100 border-bottom">
        <div className="container">
          <div className="main-text-content" style={{ maxWidth: "767px", margin: "0 auto" }}>
            <h3>Virtual Authors at SpecialNeeds.com</h3>
            <p>
              Hey there, friend! Welcome to our super cool Virtual Authors page. You might be
              wondering what a &quot;Virtual Author&quot; is, and we&apos;re here to tell you all about it! 😄
            </p>
            <p>
              You see, our Virtual Authors are a fantastic team of imaginary writers, created by
              some really smart computers. These authors have unique names, fancy vector art
              avatars, and interesting bios. But remember, they&apos;re not real people! They&apos;re here to
              help us write fun and helpful content on SpecialNeeds.com. 📝
            </p>
            <p>
              So, why do we use Virtual Authors? 🤔 Great question! There are a bunch of cool
              reasons why we decided to have these make-believe writers on our team:
            </p>
            <ol>
              <li>
                <strong>More Topics, More Fun!</strong> With Virtual Authors, we can write about a
                huge variety of topics. Since our authors come from different backgrounds and have
                different expertise, we can cover lots of subjects for you to explore and enjoy.
                It&apos;s like having a big library of knowledge right at your fingertips! 📚
              </li>
              <li>
                <strong>Faster Content Creation!</strong> Our Virtual Authors are super speedy at
                writing. They can work together and create lots of content at the same time. This
                means more exciting articles and stories for you to read and share with your
                friends. 🚀
              </li>
            </ol>
            <p>
              But hey, it&apos;s important to remember a few things about our Virtual Authors&apos; content:
            </p>
            <p>
              <strong>Not Medical Advice:</strong> While our Virtual Authors are great at writing
              helpful articles, they&apos;re not doctors or medical experts. Their content is not
              intended to be medical advice. If you have any health-related questions or concerns,
              make sure you talk to a real-life doctor or medical professional. They&apos;re the experts
              who can give you the best advice for your needs. 👩‍⚕️👨‍⚕️
            </p>
            <p>
              <strong>Helpful, But Not Perfect:</strong> Our Virtual Authors do their best to
              provide you with accurate and helpful information. But, just like everyone else, they
              can make mistakes. If you ever find something that doesn&apos;t quite make sense or you
              have a question, don&apos;t hesitate to reach out to us. We&apos;re here to help! 🤗
            </p>
            <p>
              So there you have it! Our amazing team of Virtual Authors is here to create fun,
              informative, and engaging content for you to enjoy on SpecialNeeds.com. Remember,
              they&apos;re not real people, but they sure do know how to make learning fun! 💫
            </p>
            <p>
              If you have any questions or just want to say hi, feel free to contact us. We&apos;re
              always here to help and chat with our awesome readers like you!
            </p>
            <p>Happy reading! 🌟</p>
          </div>
          <DisplayAllVirtualAuthors
            authorsRaw={authorsRaw}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export async function getStaticProps(context) {
  try {
    const api = new SpecialNeedsAPI(context);
    const authorsRaw = await api.get("/user/virtual-authors/");
    return {
      props: { authorsRaw: Array.isArray(authorsRaw) ? authorsRaw : [] },
      revalidate: 2592000, // 30 days
    };
  } catch (error) {
    return {
      props: { authorsRaw: [] },
      revalidate: 3600, // retry in 1 hour on failure
    };
  }
}


export default VirtualAuthorsPage;
