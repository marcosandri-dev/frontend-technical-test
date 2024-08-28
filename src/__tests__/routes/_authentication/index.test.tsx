import { fireEvent, screen, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthenticationContext } from "../../../contexts/authentication";
import { MemeFeedPage } from "../../../routes/_authentication/index";
import { renderWithRouter } from "../../utils";

describe("routes/_authentication/index", () => {
  describe("MemeFeedPage", () => {
    function renderMemeFeedPage() {
      return renderWithRouter({
        component: MemeFeedPage,
        Wrapper: ({ children }) => (
          <ChakraProvider>
            <QueryClientProvider client={new QueryClient()}>
              <AuthenticationContext.Provider
                value={{
                  state: {
                    isAuthenticated: true,
                    userId: "dummy_user_id",
                    token: "dummy_token",
                  },
                  authenticate: () => {},
                  signout: () => {},
                }}
              >
                {children}
              </AuthenticationContext.Provider>
            </QueryClientProvider>
          </ChakraProvider>
        ),
      });
    }

    it("should fetch the memes and display them", async () => {
      renderMemeFeedPage();

      await waitFor(() => {
        // We check that the right author's username is displayed
        expect(
          screen.getByTestId("meme-author-dummy_meme_id_1")
        ).toHaveTextContent("dummy_user_1");

        // We check that the right meme's picture is displayed
        expect(screen.getByTestId("meme-picture-dummy_meme_id_1")).toHaveStyle({
          "background-image": 'url("https://dummy.url/meme/1")',
        });

        // We check that the right texts are displayed at the right positions
        const text1 = screen.getByTestId("meme-picture-dummy_meme_id_1-text-0");
        const text2 = screen.getByTestId("meme-picture-dummy_meme_id_1-text-1");
        expect(text1).toHaveTextContent("dummy text 1");
        expect(text1).toHaveStyle({
          top: "0px",
          left: "0px",
        });
        expect(text2).toHaveTextContent("dummy text 2");
        expect(text2).toHaveStyle({
          top: "100px",
          left: "100px",
        });

        // We check that the right description is displayed
        expect(
          screen.getByTestId("meme-description-dummy_meme_id_1")
        ).toHaveTextContent("dummy meme 1");

        // We check that the right number of comments is displayed
        expect(
          screen.getByTestId("meme-comments-count-dummy_meme_id_1")
        ).toHaveTextContent("3 comments");
      });
    });

    it("should check if adding a comment works properly", async () => {
      renderMemeFeedPage();

      // Let's open the comment section.
      const collapseLink = await screen.findByTestId(
        "meme-comments-section-dummy_meme_id_1"
      );
      expect(collapseLink).toBeInTheDocument();
      fireEvent.click(collapseLink);

      // Check for the first comment to exist
      const comment1 = await screen.findByTestId(
        "meme-comment-author-dummy_meme_id_1-dummy_comment_id_1"
      );
      expect(comment1).toHaveTextContent("dummy_user_1");

      // Let's check for the input
      const input: HTMLInputElement = screen.getByTestId(
        "comment-input-dummy_meme_id_1"
      );
      expect(input).toBeInTheDocument();

      // Simulate typing into the input field
      fireEvent.change(input, { target: { value: "Meme Lord!" } });
      expect(input.value).toBe("Meme Lord!");

      // Checking if form exists
      const form = screen.getByTestId("comment-form-dummy_meme_id_1");
      expect(form).toBeInTheDocument();

      // Sending the form
      fireEvent.submit(form);

      // Checking for the new comment
      const newComment = await screen.findByTestId(
        "meme-comment-content-dummy_meme_id_1-dummy_comment_id_4"
      );
      expect(newComment).toBeInTheDocument();
      expect(newComment).toHaveTextContent("Meme Lord!");
    });
  });
});
