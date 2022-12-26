import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import { Text, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

import { zhServiceData, enServiceData, ServiceDataType } from './article';
import { useLanguage } from 'i18n/hooks';

const textStyle = {
  title1: {
    marginTop: pTd(24),
    fontSize: pTd(16),
    lineHeight: pTd(22),
    isBold: true,
  },
  title2: {
    marginTop: pTd(8),
    fontSize: pTd(14),
    lineHeight: pTd(20),
    isBold: true,
  },
  title3: {
    marginTop: pTd(24),
    fontSize: pTd(14),
    lineHeight: pTd(20),
    isBold: false,
  },
  paragraph1: {
    marginTop: pTd(8),
    fontSize: pTd(12),
    lineHeight: pTd(16),
  },
  paragraph2: {
    marginTop: pTd(8),
    fontSize: pTd(12),
    lineHeight: pTd(16),
    isBold: true,
  },
  signOff: {
    marginTop: pTd(32),
    width: '100%',
    textAlign: 'right',
    isBold: true,
  },
} as const;

const getServiceContent = (data: ServiceDataType) => ({
  title: data['Portkey Terms of Service'],
  updateTime: data['Last Updated: November 9, 2022.'],
  main: [
    { style: textStyle.title3, content: data['Dear Users,'] },
    {
      style: textStyle.paragraph1,
      content: data['Thank you for choosing Portkey...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['Portkey hereby reminds you...'],
    },
    {
      style: textStyle.title1,
      content: data['I. Confirmation and Acceptance of this Agreement'],
    },
    {
      style: textStyle.paragraph1,
      content: data['1. You understand...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['2. After you download Portkey...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['3. Portkey may...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['4. If you are under 18 years old...'],
    },
    {
      style: textStyle.title1,
      content: data['II. Definition'],
    },
    {
      style: textStyle.title2,
      content: data['1. Portkey:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means the blockchain wallet developed...'],
    },
    {
      style: textStyle.title2,
      content: `2. User`,
    },
    {
      style: textStyle.paragraph1,
      content: data['a) a User must be a natural person...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) if you are under 18 years old...'],
    },
    {
      style: textStyle.title2,
      content: data['3. Create or Import Wallet:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means you use Portkey to create or import...'],
    },
    {
      style: textStyle.title2,
      content: data['4. Wallet Password:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means the password you set when you create the wallet...'],
    },
    {
      style: textStyle.title2,
      content: data['5. Alert:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means the messages displayed on Portkey’s operation interface...'],
    },
    {
      style: textStyle.title2,
      content: data['6. Specific Users:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means Users who should cooperate with Portkey...'],
    },
    {
      style: textStyle.title2,
      content: data['7. Private Key:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['consists of 256 random bits...'],
    },
    {
      style: textStyle.title2,
      content: data['8. Public Key:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['is derived from the Private Key...'],
    },
    {
      style: textStyle.title2,
      content: data['9. Mnemonic Words:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['consists of 12 (or 15/18/21/24) words...'],
    },
    {
      style: textStyle.title2,
      content: data['10. Keystore:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means Private Key or Mnemonic Words...'],
    },
    {
      style: textStyle.title2,
      content: data['11. Tokens:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means the tokens which are supported by Portkey currently.'],
    },
    {
      style: textStyle.title2,
      content: data['12. Personal Information:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['means information recorded in electronic or...'],
    },
    {
      style: textStyle.title1,
      content: data['III. Services'],
    },
    {
      style: textStyle.paragraph1,
      content: data['1. Create or import wallet...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['2. Transfer and receive Tokens...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['3. Manage Tokens...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['4. Browse DApps...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['5. Transaction records...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['6. Suspension of services...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['7. Other services...'],
    },
    {
      style: textStyle.paragraph2,
      content: data['Users who use Portkey must understand that:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['1. In order to keep the decentralization feature of blockchain...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) store Users’ Wallet Password...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) restore Users’ Wallet Password...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['c) freeze the wallet;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['d) report the loss of wallet;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['e) restore the wallet;'],
    },

    {
      style: textStyle.paragraph1,
      content: data['f) rollback transactions.'],
    },
    {
      style: textStyle.paragraph1,
      content: data['2. Users shall take care of their devices...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['3. Portkey does not support all existing Tokens...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['4. Portkey is only a tool for Users...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['5. The DApps integrated into Portkey...'],
    },
    {
      style: textStyle.title1,
      content: data['IV. Your Rights and Obligations'],
    },
    {
      style: textStyle.paragraph1,
      content: data['1. Create or Import Wallet'],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) Create or import wallet...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) Identification verification...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['c) Portkey team may develop different versions...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['d) A previous version of Portkey...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['2. Use of Portkey'],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) Users shall take care of their devices...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) Follow the Alert...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['c) You understand that...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['d) Complete the identity verification...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['e) Transfer of Tokens'],
    },
    {
      style: textStyle.paragraph1,
      content: data['i. You understand that you may be subject to...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['ii. You understand that blockchain operations...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['iii. You understand that the following reasons...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['§  insufficient balance in wallet;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['§  insufficient fees for transaction;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['§  blockchain’s failure to execute the code of smart contracts;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '§  the transfer amount exceeds the transfer limits imposed by authorities, Portkey or laws or regulations;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['§  technical failure of the network or equipment;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['§  abandoned transactions result from blockchain network congestion or failure;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '§  the wallet address of yours or your counterparty’s is identified as special addresses, such as high-risk address, exchange address, ICO address, Token address etc.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['iv. You understand that Portkey is only a tool...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['f) Compliance.'],
    },
    {
      style: textStyle.paragraph1,
      content: data['g) Notifications.'],
    },
    {
      style: textStyle.paragraph1,
      content: data['h) Fees and taxes.'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data['i. You need to pay transaction fees charged by the blockchain network(s) when you transfer Tokens.'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'ii. You understand that under some specific circumstances, your transfer of Tokens may fail due to an unstable network, but you may still be charged transaction fees by the blockchain network(s).'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'iii. You shall bear all the applicable taxes and other expenses occurred due to your transactions on Portkey.'
        ],
    },
    {
      style: textStyle.title1,
      content: data['V. Risks'],
    },
    {
      style: textStyle.paragraph1,
      content: data['1. You understand and acknowledge that the blockchain technology...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['2. If you or your counterparty fails to comply with...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['3. When you use third-party-developed DApps integrated in Portkey...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['4. It is your sole responsibility to make sure that...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['5. You shall check the official blockchain system...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['6. You understand that after you create or import wallet on Portkey...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['7. We suggest you backup your Wallet Password...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['8. In order to avoid potential security risks...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['9. Please be alert to frauds when you use Portkey...'],
    },
    {
      style: textStyle.title1,
      content: data['VI. Change, Suspension, Termination of Portkey Services'],
    },
    {
      style: textStyle.paragraph1,
      content: data['1. You acknowledge and accept that Portkey may...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['2. You understand that Portkey may suspend services...'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'a) due to the maintenance, upgrading, failure of equipment and blockchain system and the interruption of communications etc., which lead to the suspension of the operation of Portkey;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) due to force majeure events including but not limited to typhoons...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['c) due to other events which Portkey cannot control or reasonably predicate.'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '3. Portkey reserves the right to unilaterally suspend or terminate all or part of the functions of Portkey under the following circumstances:'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) death of Users;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) if you steal others’ wallets information or mobile devices;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['c) if you refuse to allow mandatory update of Portkey;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['d) if you use Portkey to commit illegal or criminal activities;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['e) if you hinder the normal use of Portkey by other Users;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['f) if you pretend to be staff or management personnel of Portkey team;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'g) if you threaten the normal operation of Portkey computer system by attack, invasion, alternation or any other means;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['h) if you use Portkey to send spam;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['i) if you spread rumors which endanger the goodwill of Portkey team and Portkey;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'j) if you conduct any illegal activities, breach this Agreement etc. or other circumstances under which Portkey reasonably considers necessary to suspend services.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '4. You are entitled to export your wallets within a reasonable amount of time if Portkey changes, suspends or terminates its services.'
        ],
    },
    {
      style: textStyle.title1,
      content: data['VII. Your Representations and Warranties'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '1. You shall comply with all applicable laws, regulations and policies of your country of nationality and/or country of residence. You shall not use Portkey for any unlawful purposes or by any unlawful means.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '2. You shall not use Portkey to commit any illegal or unlawful activities, including but not limited to:'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) any illegal conducts, such as money laundering, illegal fund raising etc.;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'b) accessing Portkey services, collecting or processing the content provided by Portkey, intervening or attempting to intervene any Users, by the employment of any automated programs, software, network engines, web crawlers, web analytics tools, data mining tools or similar tools etc.;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['c) providing gambling information or inducing others to engage in gambling;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['d) invading into others’ Portkey to steal Tokens;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['e) engaging in any inaccurate or false transactions with the counterparty;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['f) committing any activities which harms or attempts to harm Portkey service system and data;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['g) other activities which Portkey has reason to believe are inappropriate.'],
    },
    {
      style: textStyle.paragraph1,
      content: data['3. You understand and accept that you shall be responsible...'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '4. You confirm that you will pay the service fees charged by Portkey in time (if applicable). Portkey reserves the right to suspend the services when the User fails to pay service fees (if applicable).'
        ],
    },
    {
      style: textStyle.title1,
      content: data['VIII. Disclaimer and Limitation of Liability'],
    },
    {
      style: textStyle.paragraph1,
      content: data['1. Portkey only undertakes obligations expressly set forth in this Agreement.'],
    },
    {
      style: textStyle.paragraph1,
      content: data['2. YOU ACKNOWLEDGE AND ACCEPT THAT...'],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) system maintenance or upgrading of Portkey;'],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) force majeure, such as typhoon, earthquake, flood, lightning or terrorist attack etc.;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'c) malfunction of your device hardware and software, and failure of telecommunication lines and power supply lines;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['d) your improper, unauthorized or unrecognized use of Portkey services;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'e) computer viruses, Trojan Horse, malicious program attacks, network congestion, system instability, system or equipment failure, telecommunication failure, power failure, banking issues, government acts etc.;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['f) any other reasons not imputed to Portkey.'],
    },
    {
      style: textStyle.paragraph2,
      content: data['3. Portkey shall not be held liable under the following circumstances:'],
    },
    {
      style: textStyle.paragraph2,
      content:
        data[
          'a) Users lose their devices, delete Portkey and wallets without back-up, forget Wallet Passwords, Private Keys, Mnemonic Words, Keystores without back-up, which result in the loss of their Tokens;'
        ],
    },
    {
      style: textStyle.paragraph2,
      content: data['b) Users disclose their Wallet Passwords, Private Keys...'],
    },
    {
      style: textStyle.paragraph2,
      content:
        data[
          'c) Users mishandle Portkey (including but not limited to wrong address, failure of the node servers selected by you), which result in the loss of Tokens;'
        ],
    },
    {
      style: textStyle.paragraph2,
      content:
        data[
          'd) Users are unfamiliar with the knowledge of blockchain and their mishandling of Portkey results in loss of their Tokens;'
        ],
    },
    {
      style: textStyle.paragraph2,
      content:
        data[
          'e) Portkey is unable to copy accurate transaction records due to system delay or blockchain instability etc.;'
        ],
    },
    {
      style: textStyle.paragraph2,
      content:
        data[
          'f) Users shall undertake the risks and consequences of their transactions on the third-party-developed DApps.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['4. You understand that Portkey is only a management tool for Tokens which is...'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '5. You acknowledge that Portkey may provide services to you and your counterparties simultaneously and you agree to waive any actual or potential conflicts of interest and will not claim against Portkey on such base or burden Portkey with more responsibilities or duty of care.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['6. Portkey does not warrant that:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) services provided by Portkey would satisfy all your needs;'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'b) all techniques, products, services, information or other materials from Portkey would meet your expectations;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'c) all the transaction information in digital tokens markets captured from the third party exchanges are prompt, accurate, complete, and reliable;'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          'd) your counterparties on Portkey will perform their obligations in the transaction agreements with you timely.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data['7. In any case, the total liability for Portkey under this Agreement shall not exceed the greater of:'],
    },
    {
      style: textStyle.paragraph1,
      content: data['a) USD value of 0.05 Ether; or'],
    },
    {
      style: textStyle.paragraph1,
      content: data['b) $80 USD.'],
    },
    {
      style: textStyle.paragraph1,
      content: data['8. You are aware that Portkey is only a tool for Users to manage their Tokens...'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '9. You understand that we may change our entry standards, limit the range and ways to provide services for specific Users, etc. at any time in accordance with laws, regulations and policies of your country of nationality and/or country of residence.'
        ],
    },
    {
      style: textStyle.title1,
      content: data['IX. Entire Agreement'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '1. This Agreement incorporates Portkey Terms of Service and other rules which might be modified and updated on Portkey extension, App or website.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '2. If any provision of this Agreement is found by a court with competent jurisdiction to be invalid, the other provisions of this Agreement remain in full force and effect.'
        ],
    },
    {
      style: textStyle.title1,
      content: data['X. Intellectual Property Rights Protection'],
    },
    {
      styles: textStyle.paragraph1,
      content: data['1. Portkey is an application developed and owned by Portkey team...'],
    },
    {
      style: textStyle.title1,
      content: data['XI. Governing Law and Dispute Resolution'],
    },
    {
      styles: textStyle.paragraph1,
      content: data['1. The validity, interpretation, alternation, enforcement, dispute resolution...'],
    },
    {
      styles: textStyle.paragraph1,
      content: data['2. If any dispute or claim in connection with this Agreement arises between you and Portkey...'],
    },
    {
      style: textStyle.title1,
      content: data['XII. Miscellaneous'],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '1. During your use of Portkey services, if you come across any problems, you can contact us through the submission of your feedbacks on Portkey.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content:
        data[
          '2. This Agreement is accessible for all Users on Portkey. We encourage you to read this Agreement each time you log onto Portkey.'
        ],
    },
    {
      style: textStyle.paragraph1,
      content: data['3. This Agreement shall become effective on November 9, 2022.'],
    },
    {
      style: textStyle.paragraph2,
      content:
        data[
          'As for any issues not covered in this Agreement, you shall comply with the announcements and relevant rules as updated by Portkey from time to time.'
        ],
    },
    {
      style: textStyle.signOff,
      content: data['Portkey Team'],
    },
  ],
});

export default function TermsOfService() {
  const boldStyle = useCallback((isBold: boolean) => (isBold ? fonts.mediumFont : {}), []);
  const { language } = useLanguage();

  const serviceContent = getServiceContent(language === 'zh' ? zhServiceData : enServiceData);

  return (
    <PageContainer titleDom="" type="leftBack" safeAreaColor={['blue', 'gray']} containerStyles={styles.pageContainer}>
      <Text style={styles.title}>{serviceContent.title}</Text>
      <Text style={styles.upDateTime}>{serviceContent.updateTime}</Text>
      {(serviceContent.main as any).map((ele: any) => (
        <Text
          key={ele.content}
          style={[
            {
              ...ele.style,
              ...boldStyle(!!ele.style?.isBold),
            },
          ]}>
          {ele.content}
        </Text>
      ))}
    </PageContainer>
  );
}

export const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: defaultColors.bg4,
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
  },
  title: {
    fontSize: pTd(24),
    marginTop: pTd(24),
    lineHeight: pTd(28),
  },
  upDateTime: {
    fontSize: pTd(12),
    lineHeight: pTd(16),
    marginTop: pTd(8),
  },
});
