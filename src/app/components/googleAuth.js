import Head from 'next/head';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  const handleCredentialResponse = useCallback((response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    
    // Send this to your backend for verification
    fetch('/api/Auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.credential }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      router.push('/dashboard');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }, [router]);

  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.handleCredentialResponse = handleCredentialResponse;
    };
    script.onerror = () => {
      console.error('Google API script failed to load.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [handleCredentialResponse]); // Include handleCredentialResponse here

  return (
    <div className={styles.container}>
      <Head>
        <title>Google Login with Next.js</title>
        <meta name="description" content="Google Login implementation with Next.js" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span>Google Login</span>
        </h1>

        <div className={styles.loginContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Sign In</h2>
            </div>
            <div className={styles.cardBody}>
              <div 
                id="g_id_onload"
                data-client_id="YOUR_CLIENT_ID.apps.googleusercontent.com" // Replace with your actual client ID
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleCredentialResponse"
                data-auto_prompt="false"
              ></div>

              <div 
                className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="continue_with"
                data-size="large"
                data-logo_alignment="left"
              ></div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .loginContainer {
          max-width: 400px;
          width: 100%;
          margin-top: 2rem;
        }
        
        .card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .cardHeader {
          padding: 1rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          text-align: center;
        }
        
        .cardBody {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
