"use client"

import { useSession, signOut } from "next-auth/react"
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material"
import { GitHub, Email, ExitToApp } from "@mui/icons-material"
import Link from "next/link"

export default function PublicPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "github":
        return <GitHub />
      case "google":
        return <Email />
      default:
        return <GitHub />
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "github":
        return "GitHub"
      case "google":
        return "Google"
      default:
        return "Unknown"
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {session?.provider && getProviderIcon(session.provider)}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            Dashboard - Public
          </Typography>
          <Button color="inherit" component={Link} href="/protected">
            Protected Page
          </Button>
          {session && (
            <Button color="inherit" startIcon={<ExitToApp />} onClick={() => signOut()} sx={{ ml: 2 }}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {session?.user && (
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <Avatar src={session.user.image || ""} alt={session.user.name || ""} sx={{ width: 120, height: 120 }} />
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  Welcome, {session.user.name}!
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {session.user.email}
                </Typography>
                {session.provider && (
                  <Chip
                    icon={getProviderIcon(session.provider)}
                    label={`Signed in with ${getProviderName(session.provider)}`}
                    color="primary"
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Public Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This is a public page accessible to all authenticated users. Navigate to the protected page for
                additional features.
              </Typography>
            </Box>
          </Paper>
        )}

        {!session && (
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Please sign in to view this page
            </Typography>
            <Button variant="contained" component={Link} href="/" sx={{ mt: 2 }}>
              Go to Login
            </Button>
          </Paper>
        )}
      </Container>
    </>
  )
}
