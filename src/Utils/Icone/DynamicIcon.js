import React, { Suspense } from "react";
import * as LucideIcons from "lucide-react";

const DynamicIcon = ({ name, size = 24, color = "currentColor", ...props }) => {
  const LucideComponent = LucideIcons[name];
  if (LucideComponent) {
    return <LucideComponent size={size} color={color} {...props} />;
  }

  let importFn;
  if (name.startsWith("Fa")) {
    importFn = () => import("react-icons/fa").then(mod => ({ default: mod[name] }));
  } else if (name.startsWith("Md")) {
    importFn = () => import("react-icons/md").then(mod => ({ default: mod[name] }));
  } else if (name.startsWith("Ai")) {
    importFn = () => import("react-icons/ai").then(mod => ({ default: mod[name] }));
  } else if (name.startsWith("Fi")) {
    importFn = () => import("react-icons/fi").then(mod => ({ default: mod[name] }));
  } else if (name.startsWith("Bs")) {
    importFn = () => import("react-icons/bs").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Bi")) {
    importFn = () => import("react-icons/bi").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Cg")) {
    importFn = () => import("react-icons/cg").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Di")) {
    importFn = () => import("react-icons/di").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Fi")) {
    importFn = () => import("react-icons/fi").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Fc")) {
    importFn = () => import("react-icons/fc").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Fa")) {
    importFn = () => import("react-icons/fa").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Gi")) {
    importFn = () => import("react-icons/gi").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Go")) {
    importFn = () => import("react-icons/go").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Gr")) {
    importFn = () => import("react-icons/gr").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Hi")) {
    importFn = () => import("react-icons/hi").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Im")) {
    importFn = () => import("react-icons/im").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Lia")) {
    importFn = () => import("react-icons/lia").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Io")) {
    importFn = () => import("react-icons/io").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Lu")) {
    importFn = () => import("react-icons/lu").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Md")) {
    importFn = () => import("react-icons/md").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Pi")) {
    importFn = () => import("react-icons/pi").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Rx")) {
    importFn = () => import("react-icons/rx").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Ri")) {
    importFn = () => import("react-icons/ri").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Si")) {
    importFn = () => import("react-icons/si").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Sl")) {
    importFn = () => import("react-icons/sl").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Tb")) {
    importFn = () => import("react-icons/tb").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Tfi")) {
    importFn = () => import("react-icons/tfi").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Ti")) {
    importFn = () => import("react-icons/ti").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Vsc")) {
    importFn = () => import("react-icons/vsc").then(mod => ({ default: mod[name] }));
  }else if (name.startsWith("Wi")) {
    importFn = () => import("react-icons/wi").then(mod => ({ default: mod[name] }));
  }

  
  if (!importFn) {
    return <span style={{ color: "red" }}>❌ Icon not found</span>;
  }

  const LazyIcon = React.lazy(importFn);

  return (
    <Suspense fallback={<span>⌛</span>}>
      <LazyIcon size={size} color={color} {...props} />
    </Suspense>
  );
};

export default DynamicIcon;
