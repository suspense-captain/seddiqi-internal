import Layout from "@components/layout";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { logoutCustomer } from "@utils/sfcc-connector/dataService";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession, signOut } from "next-auth/react";
import Button from "@components/module/button";
import logger, { ERROR_MESSAGES } from "@utils/logger";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth", 
      },
    };
  }

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: "account" },
      },
    },
    context
  );

  return {
    props: {
      ...data,
    },
  };
}

export default function AccountPage() {
  const userSession = useSession().data?.user;

  const handleSignOut = async () => {
    try {
        // Salesforce
        const salesforceResponse = await logoutCustomer({ 
          method: "POST", 
          userData: JSON.stringify({ refreshToken: userSession.refreshToken }),
        });

        if (!salesforceResponse.isError) {
          // NextAuth
          await signOut();
        }
    } catch (error) {
        logger.error(ERROR_MESSAGES.AUTHENTICATION.LOGOUT, error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      margin: '10rem',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h3>Hello, {userSession?.firstName} ({userSession?.email})</h3>
      <Button 
        title="SingOut" 
        clickHandler={handleSignOut}
      />
    </div>
  );
};

AccountPage.Layout = Layout;

