import { Link, useNavigate, useParams } from "react-router-dom";
import { useEquipmentById } from "../hooks/useEquipment";
import { formatDate } from "../utils/dateUtils";
import { getStatusColor } from "../utils/statusUtils";
import DetailItem from "../components/common/DetailItem";
import useEquipmentStore from "../stores/equipmentStore";
import { useEffect } from "react";

const DetailPage = () => {
  // URL から id パラメータを取得
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use global equipment store
  const { selectEquipment, addToRecentlyViewed } = useEquipmentStore();

  // id を使って特定の備品データを取得
  const { data, isLoading, isError, error } = useEquipmentById(id || "");

  // When data is loaded, update global state
  useEffect(() => {
    if (data) {
      selectEquipment(data);
      addToRecentlyViewed(data.id);
    }

    // Clear selected equipment when unmounting
    return () => {
      selectEquipment(null);
    };
  }, [data, selectEquipment, addToRecentlyViewed]);

  // ローディング時
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // エラー時
  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                エラー: {(error as Error).message}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-3 py-1 text-sm bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  // データが空の場合
  if (!data) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="text-sm text-yellow-700">
            指定された備品が見つかりませんでした。
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-3 py-1 text-sm bg-white border border-yellow-300"
          >
            商品一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">備品詳細</h1>
        <div className="flex space-x-3">
          <Link
            to="/"
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            一覧に戻る
          </Link>
          <Link
            to={`/edit/${id}`}
            className="px-3 py-2 text-sm text-gray-900 bg-slate-400 rounded-md hover:bg-slate-600 hover:text-white transition-colors"
          >
            編集する
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* カードヘッダー */}
        <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{data.name}</h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                data.status
              )}`}
            >
              {data.status}
            </span>
          </div>
        </div>

        {/* カード詳細 */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="カテゴリ" value={data.category} />
          <DetailItem label="数量" value={data.quantity.toString()} />
          <DetailItem label="保管場所" value={data.storageLocation} />
          <DetailItem
            label="使用者"
            value={data.borrower || "登録されていません"}
          />
          <DetailItem
            label="登録日"
            value={formatDate(data.createdAt)}
            className="md:col-span-2"
          />
          {data.updatedAt && (
            <DetailItem
              label="更新日"
              value={formatDate(data.updatedAt)}
              className="md:col-span-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
