import {
  Box,
  Button,
  CenteredContainer,
  GappedBox,
  Input,
  Label,
  Textarea,
  ValidationMessage,
} from "@kampus/ui";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useTransition } from "@remix-run/react";
import normalizeUrl from "normalize-url";
import { createPost } from "~/models/post.server";
import { requireUserId } from "~/session.server";
import { validate, validateURL } from "~/utils";

type ActionData = {
  error: {
    message: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const formUrl = formData.get("url")?.toString();
  const userID = await requireUserId(request);

  if (!validate(title)) {
    return json<ActionData>({
      error: { message: "Başlık en az iki harfli olmalıdır." },
    });
  }

  if (!validate(content) && !validate(formUrl)) {
    return json<ActionData>({
      error: {
        message:
          "En az 1 harften oluşacak içerik veya URL adresi eklenmelidir.",
      },
    });
  }

  let url = null;
  if (validate(formUrl)) {
    if (!validateURL(formUrl)) {
      return json<ActionData>({
        error: { message: "Lütfen geçerli bir URL adresi girin." },
      });
    } else {
      url = normalizeUrl(formUrl as string);
    }
  }

  let body = validate(content) ? content : null;

  try {
    const post = await createPost(title, userID, url, body);
    return redirect(`/posts/${post.slug}-${post.id}`);
  } catch (e) {
    return json(e, { status: 500 });
  }
};

const Send = () => {
  const transition = useTransition();
  const fetcher = useFetcher();
  const meta = fetcher.data?.meta;
  const error = fetcher.data?.error;

  const onPaste = (event: any) => {
    let url :string;
    if(event.target?.value?.trim()){
       url = event.target?.value?.trim();
    } else {
       url = event.clipboardData?.getData("text")
    }
    const formData = new FormData();
    formData.set("url", url);
    fetcher.submit(formData, { method: "post", action: "/api/parse-meta" });
  };
  const debounce = (event: any) => {
    const oldUrl = event.target?.value
    setTimeout(() => {
        if(oldUrl === event.target?.value){
          onPaste(event)
        }
    }, 1500)
  }
  return (
    <CenteredContainer css={{ paddingTop: 20 }}>
      <fetcher.Form method="post">
        <GappedBox css={{ flexDirection: "column" }}>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            name="url"
            size="2"
            onPaste={onPaste}
            onChange={debounce}
          />
          <Label htmlFor="title">Başlık</Label>
          <Input
            id="title"
            name="title"
            size="2"
            defaultValue={meta ? meta.title : ""}
          />
          <Label htmlFor="content">İçerik</Label>
          <Textarea
            css={{ width: "auto", cursor: "text", resize: "both" }}
            name="content"
            defaultValue={meta ? meta.description : ""}
            rows={4}
          />
          <Box>
            <Button size="2" type="submit" variant="green">
              {transition.submission ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </Box>
          {error && (
            <ValidationMessage
              error={error.message}
              isSubmitting={transition.state === "submitting"}
            />
          )}
        </GappedBox>
      </fetcher.Form>
    </CenteredContainer>
  );
};

export default Send;
