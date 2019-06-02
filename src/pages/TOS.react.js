// @flow

import React, { Component } from "react";
import { Page, Grid, Card, Icon } from "tabler-react";

import faIcons from "../data/icons/fa";
import feIcons from "../data/icons/fe";
import flagIcons from "../data/icons/flag";
import paymentIcons from "../data/icons/payment";

const iconSets: Array<{
  prefix: "fa" | "fe" | "flag" | "payment",
  title: string,
  icons: Array<string>,
  description?: string,
  link?: string,
}> = [
  {
    prefix: "fe",
    title: "Feather Icons",
    icons: feIcons,
    description: "Simply beautiful open source icons.",
    link: "https://feathericons.com",
  },
  {
    prefix: "fa",
    title: "Font Awesome",
    icons: faIcons,
    description: "Powered by Font Awesome set.",
    link: "http://fontawesome.io",
  },
  { prefix: "flag", title: "Flags", icons: flagIcons },
  { prefix: "payment", title: "Payments", icons: paymentIcons },
];

class TOS extends Component {
  render() {
    return (
      <Page.Content>
        <Card>
          <Card.Header>
            <Card.Title>Terms of Service</Card.Title>
          </Card.Header>
          <Card.Body>
            <Grid.Row>
              <Grid.Col lg={12}>
              <ol>
              <li><strong> Terms of Service</strong></li>
              </ol>
              <p>These Terms of Service ("Terms") govern your access to and use of NEOTT, including any NEOTT mobile applications and websites (the "Services"), and any videos, information, text, graphics, photos or other materials uploaded, downloaded or appearing on the Services (collectively referred to as "Content"). Your access to and use of the Services is conditioned on your acceptance of and compliance with these Terms. By accessing or using the Services you agree to be bound by these Terms. We also use YouTube API Services in some of our products, that means if you are using a NEOTT service which makes use of Youtube APIs, then you are agreeing to the&nbsp;<a href="https://www.youtube.com/static?gl=HK&amp;template=terms"><strong>YouTube Terms of Service</strong></a>&nbsp;as well . We also use MetaMask API Services in some of our products, that means if you are using NETOTT's service which makes use of MetaMask APIs, then you are agreeing to the&nbsp;<a href="https://metamask.io/terms.html">MetaMask Terms of Use</a>&nbsp;as well as <a href="https://metamask.io/privacy.html">MetaMask Privacy Policy</a>&nbsp;.</p>
              <p>And in the similar manner any other API that NEOTT would be using, your acceptance shall be implied in that case as well..</p>
              <ol start="2">
              <li><strong> Basic Terms</strong></li>
              </ol>
              <p>You are solely and exclusively responsible for your use of the Services, for any Content you post to the Services, and for any consequences thereof. The Content you submit, post, or display will be able to be viewed by other users of the Services and through third party services and websites. You should only provide Content that you are comfortable sharing with others under these Terms.&nbsp;</p>
              <p><br /> <br /> You may use the Services only if you can form a binding contract with NEOTT and are not a person barred from receiving services under the Indian laws. If you are accepting these Terms and using the Services on behalf of a company, organization, government, or other legal entity, you represent and warrant that you are explicitly authorized to do so. You may use the Services specifically in strict compliance with these Terms and all applicable laws and rules and regulations, applicable from time to time. .&nbsp;<br /> <br /> The Services that NEOTT provides are always evolving, the form and nature of the Services that NEOTT provides may change from time to time without prior notice to you. In addition, NEOTT may stop (permanently or temporarily) providing the Services (or any features within the Services) to you or to users generally and may not be able to provide you with prior notice. We also retain the right to create limits on use and storage, at our sole discretion at any time without prior notice to you.&nbsp;</p>
              <p><br /> <br /> The Services may include interest-based ads which are online ads that are tailored to your likely interests based on your use of various apps and websites across the Internet, the same may not be skipped as well. If you are using a browser, then cookies and web beacons can be used to collect information to help determine your likely interests. If you are using a mobile device, tablet, or streaming media device that includes an advertising identifier, then that identifier can be used to help determine your likely interests. The types and extent of advertising by NEOTT on the Services are subject to change at its sole discretion. In consideration for NEOTT granting you access to and use of the Services, you agree that NEOTT and its parent, third party providers and partners may place such advertising on the Services or in connection with the display of Content or information from the Services whether submitted by you or others.</p>
              <ol start="3">
              <li><strong> Privacy</strong></li>
              </ol>
              <p>Any information that you provide to NEOTT is subject to our&nbsp;<a href="https://www.mxplayer.in/privacy-policy"><strong>Privacy Policy</strong></a>, which governs our collection and use of your information. You understand that through your use of the Services you consent to the collection and use (as set forth in the Privacy Policy) of this information, including the transfer of this information to any place and/or location as used by NEOTT. As part of providing you the Services, we may need to provide you with certain communications, such as service announcements and administrative messages. These communications are considered part of the Services and your NEOTT account, which you may not be able to opt-out from receiving.</p>
              <ol start="4">
              <li><strong> Passwords</strong></li>
              </ol>
              <p>You are responsible for safeguarding the password or credentials that you use to access the Services and for any activities or actions under your account. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower-case letters, numbers and symbols) with your account and with other accounts that you may connect to your NEOTT account (such as Twitter or your email). NEOTT cannot and shall not be liable for any loss or damage arising from your failure to comply with the above requirements.</p>
              <ol start="5">
              <li><strong> Content on the Services</strong></li>
              </ol>
              <p>All Content, whether publicly posted or privately transmitted, is the sole responsibility of the person who originated such Content. We may, but are not required to monitor or control the Content posted via the Services and we cannot take responsibility for any such Content. Any use or reliance on any Content or materials posted via the Services or obtained by you through the Services is at your own risk.&nbsp;</p>
              <p><br /> We do not endorse, support, represent or guarantee the completeness, truthfulness, accuracy, or reliability of any Content or communications posted via the Services or endorse any opinions expressed via the Services. You understand that by using the Services, you may be exposed to Content that might be offensive, harmful, inaccurate or otherwise inappropriate, or in some cases, postings that have been mislabeled or are otherwise deceptive. Under no circumstances will NEOTT be liable in any way for any Content, including, but not limited to, any errors or omissions in any Content, or any loss or damage of any kind incurred as a result of the use of any Content posted, emailed, transmitted or otherwise made available via the Services or broadcast elsewhere.</p>
              <ol start="6">
              <li><strong> Your Rights</strong></li>
              </ol>
              <p>You retain your rights to any Content you submit, post or display on or through the Services. In order to make the Services available to you and other users, NEOTT needs a license from you. By submitting, posting or displaying Content on or through the Services, you grant us a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such Content in any and all media or distribution methods (now known or later developed).You agree that this license includes the right for NEOTT to provide, promote, and improve the Services and to make Content submitted to or through the Services available to other companies, organizations or individuals who partner with NEOTT for the syndication, broadcast, distribution or publication of such Content on other media and services, subject to our terms and conditions for such Content use. Such additional uses by NEOTT, or other companies, organizations or individuals who partner with NEOTT, may be made with no compensation paid to you with respect to the Content that you submit, post, transmit or otherwise make available through the Services.&nbsp;</p>
              <p><br /> We may modify or adapt your Content in order to transmit, display or distribute it over computer networks and in various media and/or make changes to your Content as are necessary to conform and adapt that Content to any requirements or limitations of any networks, devices, services or media. For example, if you choose to share a video through your connected Twitter account, we will adapt your Content so that it can be attached to a Tweet in a Twitter card.&nbsp;<br /> <br /> You are responsible for your use of the Services, for any Content you provide, and for any consequences thereof, including the use of your Content by other users and our third-party partners. You understand that your Content may be syndicated, broadcast, distributed, or published by our partners and if you do not have the right to submit Content for such use, it may subject you to liability. NEOTT will not be responsible or liable for any use of your Content by NEOTT. You represent and warrant that you have all the rights, power and authority necessary to grant the rights granted herein to any Content that you submit.</p>
              <ol start="7">
              <li><strong> Your License to Use the Services</strong></li>
              </ol>
              <p>NEOTT gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software that is provided to you by NEOTT as part of the Services. This license is for the sole purpose of enabling you to use and enjoy the benefit of the Services as provided by NEOTT, in the manner permitted by these Terms.</p>
              <ol start="8">
              <li><strong> NEOTT Rights</strong></li>
              </ol>
              <p>All right, title and interest in and to the Services (excluding Content provided by users) are and will remain the exclusive property of NEOTT and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries. NEOTT reserves all rights which are not expressly granted in these Terms. You acknowledge and agree that any feedback, comments, or suggestions you may provide regarding NEOTT or the Services are entirely voluntary and we will be free to use such feedback, comments or suggestions as we see fit and without any obligation to you.</p>
              <ol start="9">
              <li><strong> Restrictions on Content and Use of the Services</strong></li>
              </ol>
              <p>We reserve the right at all times (but will not have an obligation) to remove or refuse to distribute any Content on the Services, to suspend or terminate users, and to reclaim usernames and profile URLs without liability to you.&nbsp;</p>
              <p><br /> We also reserve the right to access, read, preserve, and disclose any information as we reasonably believe is necessary to (i) satisfy any applicable law, regulation, legal process or governmental request, (ii) enforce the Terms, including investigation of potential violations hereof, (iii) detect, prevent, or otherwise address fraud, security or technical issues, (iv) respond to user support requests, or (v) protect the rights, property or safety of NEOTT, its users and the public. NEOTT does not disclose personally identifying information to third parties except in accordance with our&nbsp;<a href="https://www.mxplayer.in/privacy-policy"><strong>Privacy Policy</strong></a>.</p>
              <p>&nbsp;<br /> You may not do any of the following while accessing or using the Services: (i) access, tamper with, or use non-public areas of the Services, NEOTT's computer systems, or the technical delivery systems of NEOTT's providers; (ii) probe, scan, or test the vulnerability of any system or network or breach or circumvent any security or authentication measures; (iii) access or search or attempt to access or search the Services by any means (automated or otherwise) other than through our currently available, published interfaces that are provided by NEOTT (and only pursuant to those terms and conditions), unless you have been specifically allowed to do so in a separate agreement with NEOTT (NOTE: crawling the Services is permissible if done in accordance with the provisions of the robots.txt file, however, scraping the Services without the prior consent of NEOTT is expressly prohibited); (iv) forge any TCP/IP packet header or any part of the header information in any email or posting, or in any way use the Services to send altered, deceptive or false source-identifying information; or (v) interfere with, or disrupt, (or attempt to do so), the access of any user, host or network, including, without limitation, sending a virus, overloading, flooding, spamming, mail-bombing the Services, or by scripting the creation of Content in such a manner as to interfere with or create an undue burden on the Services. If found in violation of any of any of these, you shall be liable for strict criminal as well as civil action against you, which shall be entirely at your own peril as to cost and risk.</p>
              <ol start="10">
              <li><strong> Copyright Policy</strong></li>
              </ol>
              <p><strong>NEOTT</strong></p>
              <ol start="11">
              <li><strong> Disclaimers and Limitations of Liability</strong></li>
              </ol>
              <p>Please read this section carefully since it limits the liability of NEOTT and its parents, subsidiaries, affiliates, related companies, officers, directors, employees, agents, representatives, partners, and licensors (collectively, the "NEOTT Entities"). Each of the subsections below only applies up to the maximum extent permitted under applicable law. Some jurisdictions do not allow the disclaimer of implied warranties or the limitation of liability in contracts, and as a result, the contents of this section may not apply to you. Nothing in this section is intended to limit any rights you may have which may not be lawfully limited.</p>
              <p><strong>11.1 The Services are Available "AS-IS"</strong></p>
              <p>Your access to and use of the Services or any Content is at your own risk. You understand and agree that the Services is provided to you on an "AS IS" and "AS AVAILABLE" basis. Without limiting the foregoing, NEOTT entities disclaim all warranties and conditions, whether express or implied, of merchantability, fitness for a particular purpose, or non-infringement.&nbsp;<br /> <br /> NEOTT Entities make no warranty and disclaim all responsibility and liability for: (i) the completeness, accuracy, availability, timeliness, security or reliability of the Services or any Content; (ii) any harm to your computer system, loss of data, or other harm that results from your access to or use of the Services, or any Content; (iii) the deletion of, or the failure to store or to transmit, any Content and other communications maintained by the Services; (iv) whether the Services will meet your requirements or be available on an uninterrupted, secure, or error-free basis. No advice or information, whether oral or written, obtained from NEOTT Entities or through the Services, will create any warranty not expressly made herein.</p>
              <p><strong>11.2 Links</strong></p>
              <p>The Services may contain links to third-party websites or resources. You acknowledge and agree that we are not responsible or liable for: (i) the availability or accuracy of such websites or resources; or (ii) the content, products, or services on or available from such websites or resources. Links to such websites or resources do not imply any endorsement by NEOTT Entities of such websites or resources or the content, products, or services available from such websites or resources. You acknowledge sole responsibility for and assume all risk arising from your use of any such websites or resources.</p>
              <p><strong>11.3 Limitation of Liability</strong></p>
              <p><strong>NEOTT</strong> entities shall not be liable for any indirect, incidental, special, consequential or punitive damages or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, good-will, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the services; (ii) any conduct or content of any third party on the services, including without limitation, any defamatory, offensive or illegal conduct of other users or third parties; (iii) any content obtained from the services; or (iv) unauthorized access, use or alteration of your transmissions or content.</p>
              <p>NEOTT entities shall not be held liable for any loss or damage caused by a distributed denial-of-service (DDOS) attack, viruses, or other technologically harmful material that may infect your computer equipment, computer programs, data or other proprietary material due to your use of the Website or any services or items obtained through the Website or to your downloading of any material posted on it, or any website linked to it.</p>
              <p><br /> The limitations of this subsection shall apply to any theory of liability, whether based on warranty, contract, statute, tort (including negligence) or otherwise, and whether or not the NEOTT entities have been informed of the possibility of any such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>
              <ol start="12">
              <li><strong> General Terms</strong></li>
              </ol>
              <p>All right, title and interest in and to the Services (excluding Content provided by users) are and will remain the exclusive property of NEOTT and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries. NEOTT reserves all rights not expressly granted in these Terms. You acknowledge and agree that any feedback, comments, or suggestions you may provide regarding NEOTT or the Services are entirely voluntary and we will be free to use such feedback, comments or suggestions as we see fit and without any obligation to you.</p>
              <p><strong>12.1 Waiver and Severability</strong></p>
              <p>The failure of NEOTT to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision. In the event that any provision of these Terms is held to be invalid or unenforceable, then that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions of these Terms will remain in full force and effect.</p>
              <p><strong>12.2 Controlling Law and Jurisdiction</strong></p>
              <p>These Terms and any action related thereto shall be strictly governed by the laws of India without regard to or application of its conflict of law provisions or your state or country of residence. All claims, legal proceedings or litigation arising in connection with the Services will be brought solely in India and you consent to the jurisdiction of and venue in such courts and waive any objection as to inconvenient forum.</p>
              <p><strong>12.3 Entire Agreement</strong></p>
              <p>These Terms and our&nbsp;<a href="https://www.mxplayer.in/privacy-policy"><strong>Privacy Policy</strong></a>&nbsp;are the entire and exclusive agreement between NEOTT and you regarding the Services (excluding any services for which you have a separate agreement with NEOTT that is explicitly in addition or in place of these Terms), and these Terms supersede and replace any prior agreements between NEOTT and you regarding the Services.&nbsp;</p>
              <p><br /> We may revise these Terms from time to time, the most current version will always be at&nbsp;<a href="https://www.neott.in/privacy-policy"><strong>https://www.neott.in/privacy-policy</strong></a>. If the revision, in our sole discretion, is material we will notify you via email to the email associated with your account or through the Services. If you do not wish to be bound by any such revisions to the Terms, you must end these Terms with us. By continuing to access or use the Services after those revisions become effective, you agree to be bound by the revised Terms.</p>
              <p>These Services are operated and provided exclusively by <strong>NEOTT</strong>. If you have any questions about these Terms, please contact us&nbsp;<a href="mailto:support@neott.in"><strong>support@neott.in</strong></a></p>

              </Grid.Col>
            </Grid.Row>
          </Card.Body>
        </Card>
      </Page.Content>
    );
  }
}

export default TOS;