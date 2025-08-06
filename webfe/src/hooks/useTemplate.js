import { useCallback, useEffect } from "react";
import {
  fetchTemplateById,
  fetchTemplates,
  setTemplate,
  setTemplates,
  updateTemplate,
  createTemplate,
  deleteTemplate,
  setMode,
} from "../lib/features/template";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../components/ui/toast";
import { extractErrorMessage, createErrorHandler } from "../utils/errorUtils";

const useTemplate = () => {
  const dispatch = useDispatch();
  const { template, templates, loading, error, mode } = useSelector(
    (state) => state.template
  );
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(fetchTemplates({ skip: 0, take: 10, filter: {} }));
  }, [dispatch]);

  const setTemplateCallback = useCallback(
    (template) => dispatch(setTemplate(template)),
    [dispatch]
  );
  
  const getTemplateById = useCallback(
    (id) => {
      dispatch(fetchTemplateById(id));
    },
    [dispatch]
  );
  
  const getTemplates = useCallback(() => {
    dispatch(fetchTemplates({ skip: 0, take: 10, filter: {} }));
  }, [dispatch]);

  const updateTemplateCallback = useCallback(
    (template) => {
      const { id, ...templateData } = template;
      return dispatch(updateTemplate({ id, templateData }))
        .unwrap() // This unwraps the promise and throws on rejection
        .then((result) => {
          addToast({
            title: "Success!",
            description: `Template "${template.name}" has been updated successfully.`,
            variant: "info"
          });
          return result;
        })
        .catch(createErrorHandler(addToast, 'update', 'template'));
    },
    [dispatch, addToast]
  );

  const createTemplateCallback = useCallback(
    (template) => {
      return dispatch(createTemplate(template))
        .unwrap() // This unwraps the promise and throws on rejection
        .then((result) => {
          addToast({
            title: "Template Created!",
            description: `Great! Your new template "${template.name}" has been created and is ready to use.`,
            variant: "info"
          });
          return result;
        })
        .catch(createErrorHandler(addToast, 'create', 'template'));
    },
    [dispatch, addToast]
  );

  const deleteTemplateCallback = useCallback(
    (id) => {
      return dispatch(deleteTemplate(id))
        .unwrap() // This unwraps the promise and throws on rejection
        .then((result) => {
          addToast({
            title: "Template Deleted",
            description: "The template has been permanently removed from your system.",
            variant: "destructive"
          });
          return result;
        })
        .catch(createErrorHandler(addToast, 'delete', 'template'));
    },
    [dispatch, addToast]
  );

  const setModeCallback = useCallback(
    (modeKey) => dispatch(setMode(modeKey)),
    [dispatch]
  );

  return {
    mode,
    template,
    templates,
    loading,
    error,
    setTemplate: setTemplateCallback,
    getTemplateById,
    getTemplates,
    updateTemplate: updateTemplateCallback,
    createTemplate: createTemplateCallback,
    deleteTemplate: deleteTemplateCallback,
    setMode: setModeCallback,
  };
};

export default useTemplate;
