import { createFileRoute } from "@tanstack/react-router";
import CreateMemePage from "../../components/create-meme";

export const Route = createFileRoute("/_authentication/create")({
  component: CreateMemePage,
});
