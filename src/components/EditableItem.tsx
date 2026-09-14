"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type EditContextValue = {
  setEditing: (value: boolean) => void;
};

const EditContext = createContext<EditContextValue | null>(null);

// 목록의 각 항목을 "보기"와 "수정" 두 모드로 토글하는 공용 래퍼.
// view/editForm은 서버 컴포넌트가 미리 만들어 둔 (서버 액션이 이미 바인딩된) JSX이며,
// 그 안의 EditTrigger/CancelEditButton이 이 컨텍스트를 통해 모드를 전환한다.
// 저장에 성공하면 Server Action이 revalidatePath로 목록을 다시 그리면서
// 이 컴포넌트도 새로 마운트되어 자동으로 보기 모드로 돌아온다.
export function EditableItem({
  view,
  editForm,
}: {
  view: ReactNode;
  editForm: ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <EditContext.Provider value={{ setEditing }}>
      {editing ? editForm : view}
    </EditContext.Provider>
  );
}

export function EditTrigger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(EditContext);
  return (
    <button
      type="button"
      className={className}
      onClick={() => ctx?.setEditing(true)}
    >
      {children}
    </button>
  );
}

export function CancelEditButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(EditContext);
  return (
    <button
      type="button"
      className={className}
      onClick={() => ctx?.setEditing(false)}
    >
      {children}
    </button>
  );
}
