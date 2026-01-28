import { fetchAdminQuestions } from "@/lib/api/server/question.server";
import AdminQuestionTable from "@/components/questions/AdminQuestionTable";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const data = await fetchAdminQuestions({
    page: Number(params.page) || 1,
    answered:
      params.answered === undefined ? undefined : params.answered === "true",
    isHidden:
      params.isHidden === undefined ? undefined : params.isHidden === "true",
  });

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Q&A moderation</h1>
      <AdminQuestionTable initialData={data} />
    </main>
  );
}
