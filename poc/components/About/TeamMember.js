import { serveAsset } from "@utils/assetHelpers";
import Image from "next/image";

const TeamMember = () => {
  return (
    <>
      <section className="team-area pt-100 pb-70 bg-f9f9f9">
        <div className="container">
          <div className="section-title">
            <h2>Meet the Inspirational Minds Behind SpecialNeeds.com</h2>
            <p>
              Our team is made up of passionate, dedicated individuals committed to making a
              meaningful difference in the world of special needs. Each member brings a unique blend
              of skills and experiences that fuel our mission to create an inclusive, supportive
              community.
            </p>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="single-team-member">
                <div className="member-image">
                  <a
                    href="https://www.linkedin.com/in/branndon-coelho-engineer/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={serveAsset("branndonCoelhoHeadshot", null, 250)}
                      alt="image"
                      style={{ height: "250px" }}
                      width={250}
                      height={250}
                    />
                  </a>
                </div>

                <div className="member-content">
                  <h3>
                    <a
                      href="https://www.linkedin.com/in/branndon-coelho-engineer/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Branndon Coelho
                    </a>
                  </h3>
                  <span>Chief Digital Officer</span>
                  <p>
                    Branndon is our tech wizard, bringing innovative digital solutions to enhance
                    our platform&apos;s user experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="single-team-member">
                <div className="member-image">
                  <Image
                    src={serveAsset("merryPotter", null, 250)}
                    alt="image"
                    style={{ height: "250px" }}
                    width={247}
                    height={250}
                  />
                </div>

                <div className="member-content">
                  <h3>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Merry Potter
                    </a>
                  </h3>
                  <span>Operations Lead</span>
                  <p>
                    As our operations lead, Merry ensures the seamless coordination of our resources
                    to best serve our community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamMember;
