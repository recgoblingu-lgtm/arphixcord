import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Invite from "./pages/Invite";
import Profile from "./pages/Profile";
import Direct from "./pages/Direct";
import Voice from "./pages/Voice";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/invite/:code" component={Invite} />
      <Route path="/profile" component={Profile} />
      <Route path="/dm/:userId" component={Direct} />
      <Route path="/voice/:serverId/:channelId" component={Voice} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster theme="dark" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
